import type {
	EdictRuneParams,
	EdictRuneResponse,
} from "@midl-xyz/midl-js-core";
import { useEdictRune, useMidlContext } from "@midl-xyz/midl-js-react";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { type Client, type StateOverride, parseUnits } from "viem";
import { estimateGasMulti } from "viem/actions";
import { useWalletClient } from "wagmi";
import { useStore } from "zustand";
import { multisigAddress } from "~/config";
import { useEVMAddress } from "~/hooks/useEVMAddress";
import { useLastNonce } from "~/hooks/useLastNonce";
import { usePublicKey } from "~/hooks/usePublicKey";
import { useSignTransaction } from "~/hooks/useSignTransaction";
import type { TransactionIntention } from "~/types/intention";
import { calculateTransactionsCost } from "~/utils";

type FinalizeMutationVariables = {
	/**
	 * State override to estimate the cost of the transaction
	 */
	stateOverride?: StateOverride;
};

type UseFinalizeTxIntentionsParams = {
	mutation?: Omit<
		UseMutationOptions<EdictRuneResponse, Error, FinalizeMutationVariables>,
		"mutationFn"
	>;
};

/**
 * Custom hook to finalize transaction intentions for BTC transactions.
 *
 * This hook processes all pending transaction intentions by calculating their total cost,
 * preparing the necessary BTC transfers, and executing the `edictRune` action.
 * It also allows signing individual transaction intentions.
 *
 * @example
 * ```typescript
 * const { finalizeBTCTransaction, signIntention, isLoading } = useFinalizeTxIntentions({ stateOverride });
 *
 * // To finalize all BTC transactions
 * finalizeBTCTransaction();
 *
 * // To sign a specific transaction intention
 * signIntention(transactionIntention);
 * ```
 *
 * @returns
 * - **finalizeBTCTransaction**: `() => void` – Function to initiate finalizing BTC transactions.
 * - **finalizeBTCTransactionAsync**: `() => Promise<EdictRuneResponse>` – Function to asynchronously finalize BTC transactions.
 * - **signIntention**: `(intention: TransactionIntention) => void` – Function to sign a specific transaction intention.
 * - **signIntentionAsync**: `(intention: TransactionIntention) => Promise<SignTransactionResult>` – Function to asynchronously sign an intention.
 * - **intentions**: `TransactionIntention[]` – The current list of transaction intentions.
 * - **signIntentionState**: `UseMutationState` – The state of the sign intention mutation.
 * - Other mutation states from `useMutation`.
 */
export const useFinalizeTxIntentions = ({
	mutation,
}: UseFinalizeTxIntentionsParams = {}) => {
	const { store, config } = useMidlContext();
	const { intentions = [] } = useStore(store);
	const { edictRuneAsync } = useEdictRune();
	const { signTransactionAsync } = useSignTransaction();
	const publicKey = usePublicKey();
	const { data: publicClient } = useWalletClient();
	const nonce = useLastNonce();
	const evmAddress = useEVMAddress();

	const { mutate, mutateAsync, data, ...rest } = useMutation<
		EdictRuneResponse,
		Error,
		FinalizeMutationVariables
	>({
		mutationFn: async ({ stateOverride } = {}) => {
			if (!config.network) {
				throw new Error("No network set");
			}

			const { intentions } = store.getState();

			if (!intentions) {
				throw new Error("No intentions set");
			}

			const gasLimits = await estimateGasMulti(publicClient as Client, {
				transactions: intentions.map((it) => it.evmTransaction).filter(Boolean),
				stateOverride,
				account: evmAddress,
			});

			intentions.forEach((it, i) => {
				it.evmTransaction.gas = gasLimits[i];
			});

			const totalCost = await calculateTransactionsCost(
				intentions.map((it) => it.evmTransaction).filter(Boolean),
				config,
				{
					hasDeposit: intentions.some((it) => it.hasDeposit),
					hasWithdraw: intentions.some((it) => it.hasWithdraw),
					hasRunesDeposit: intentions.some((it) => it.hasRunesDeposit),
					hasRunesWithdraw: intentions.some((it) => it.hasRunesWithdraw),
				},
			);

			const btcTransfer = intentions.reduce((acc, it) => {
				return acc + (it.evmTransaction.value ?? 0n);
			}, 0n);

			const amountToSend = Number(totalCost + btcTransfer);

			const transfers: EdictRuneParams["transfers"] = [
				{
					receiver: multisigAddress[config.network.id],
					// TODO: Avoid dust
					amount: amountToSend > 546 ? amountToSend : 546,
				},
			];

			const runes = Array.from(
				intentions
					.filter((it) => it.hasRunesDeposit)
					.map((it) => {
						if (!it.rune) {
							throw new Error("No rune set");
						}

						return it.rune;
					})
					.reduce(
						(acc, rune) => {
							acc.set(rune.id, {
								id: rune.id,
								value: acc.get(rune.id)
									? // biome-ignore lint/style/noNonNullAssertion: <explanation>
										acc.get(rune.id)!.value + rune.value
									: rune.value,
							});

							return acc;
						},
						new Map<
							string,
							{
								id: string;
								value: bigint;
							}
						>(),
					)
					.values(),
			);

			if (runes.length > 2) {
				throw new Error("Transferring more than two runes is not allowed");
			}

			for (const rune of runes) {
				transfers.push({
					receiver: multisigAddress[config.network.id],
					amount: rune.value,
					runeId: rune.id,
				});
			}

			const data = await edictRuneAsync({
				transfers,
				publish: false,
			});

			return data;
		},
		...mutation,
	});

	const {
		mutate: signIntention,
		mutateAsync: signIntentionAsync,
		...restSignIntention
	} = useMutation({
		mutationFn: async ({
			intention,
			txId,
		}: {
			intention: TransactionIntention;
			txId: string;
		}) => {
			if (!publicKey) {
				throw new Error("No public key set");
			}

			if (!intention.evmTransaction) {
				throw new Error("No EVM transaction set");
			}

			intention.evmTransaction = {
				...intention.evmTransaction,
				nonce:
					nonce +
					intentions
						.filter((it) => Boolean(it.evmTransaction))
						.findIndex((it) => it === intention),
				gasPrice: parseUnits("1", 3),
				publicKey,
				btcTxHash: `0x${txId}`,
			};

			const signed = await signTransactionAsync({
				tx: intention.evmTransaction,
			});

			store.setState({
				intentions: intentions.map((it) => {
					if (it === intention) {
						return {
							...it,
							signedEvmTransaction: signed,
						};
					}

					return it;
				}),
			});

			return signed;
		},
	});

	return {
		finalizeBTCTransaction: mutate,
		finalizeBTCTransactionAsync: mutateAsync,
		signIntention,
		signIntentionAsync,
		intentions,
		signIntentionState: restSignIntention,
		...rest,
	};
};
