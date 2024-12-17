import {
	type EdictRuneParams,
	type EdictRuneResponse,
	type TransferBTCParams,
	type TransferBTCResponse,
	ensureMoreThanDust,
} from "@midl-xyz/midl-js-core";
import {
	useEdictRune,
	useMidlContext,
	useTransferBTC,
} from "@midl-xyz/midl-js-react";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
	encodeFunctionData,
	type Address,
	type Client,
	type StateOverride,
} from "viem";
import { estimateGasMulti } from "viem/actions";
import { useChainId, useGasPrice, useWalletClient } from "wagmi";
import { useStore } from "zustand";
import { executorAddress, multisigAddress } from "~/config";
import { executorAbi } from "~/contracts/abi";
import { useAddTxIntention } from "~/hooks/useAddTxIntention";
import { useEVMAddress } from "~/hooks/useEVMAddress";
import { useLastNonce } from "~/hooks/useLastNonce";
import { usePublicKey } from "~/hooks/usePublicKey";
import { useSignTransaction } from "~/hooks/useSignTransaction";
import type { TransactionIntention } from "~/types/intention";
import { calculateTransactionsCost, convertETHtoBTC } from "~/utils";

type FinalizeMutationVariables = {
	/**
	 * State override to estimate the cost of the transaction
	 */
	stateOverride?: StateOverride;
	/**
	 * If true, send complete transaction
	 */
	shouldComplete?: boolean;

	assetsToWithdraw?: [Address] | [Address, Address];

	feeRateMultiplier?: number;
};

type UseFinalizeTxIntentionsResponse = EdictRuneResponse | TransferBTCResponse;

type UseFinalizeTxIntentionsParams = {
	mutation?: Omit<
		UseMutationOptions<
			UseFinalizeTxIntentionsResponse,
			Error,
			FinalizeMutationVariables
		>,
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
 * - **btcTransaction**: `EdictRuneResponse` – The finalized BTC transaction.
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
	const { transferBTCAsync } = useTransferBTC();
	const { signTransactionAsync } = useSignTransaction();
	const publicKey = usePublicKey();
	const { data: publicClient } = useWalletClient();
	const nonce = useLastNonce();
	const evmAddress = useEVMAddress();
	const { data: gasPrice } = useGasPrice();
	const { addTxIntention } = useAddTxIntention();
	const chainId = useChainId();

	const { mutate, mutateAsync, data, ...rest } = useMutation<
		UseFinalizeTxIntentionsResponse,
		Error,
		FinalizeMutationVariables
	>({
		mutationFn: async ({
			stateOverride,
			shouldComplete,
			assetsToWithdraw,
			feeRateMultiplier,
		} = {}) => {
			if (!config.network) {
				throw new Error("No network set");
			}

			const { intentions } = store.getState();

			if (!intentions) {
				throw new Error("No intentions set");
			}

			const evmTransactions = intentions
				.map((it) => it.evmTransaction)
				.filter(Boolean);

			const gasLimits = await estimateGasMulti(publicClient as Client, {
				transactions: evmTransactions,
				stateOverride,
				account: evmAddress,
			});

			for (const [i, intention] of intentions
				.filter((it) => Boolean(it.evmTransaction))
				.entries()) {
				intention.evmTransaction.gas = BigInt(
					Math.ceil(Number(gasLimits[i]) * 1.2),
				);
			}

			const hasWithdraw =
				intentions.some((it) => it.hasWithdraw) || shouldComplete;
			const hasRunesWithdraw =
				intentions.some((it) => it.hasRunesWithdraw) ||
				(shouldComplete && (assetsToWithdraw?.length ?? 0) > 0);

			const totalCost = await calculateTransactionsCost(
				[
					...evmTransactions,
					...(shouldComplete
						? [
								{
									gas: 300_000n,
								},
							]
						: []),
				],
				config,
				{
					feeRateMultiplier,
					gasPrice,
					hasDeposit: intentions.some((it) => it.hasDeposit),
					hasWithdraw: hasWithdraw,
					hasRunesDeposit: intentions.some((it) => it.hasRunesDeposit),
					hasRunesWithdraw: hasRunesWithdraw,
					assetsToWithdrawSize: assetsToWithdraw?.length ?? 0,
				},
			);

			const btcTransfer = convertETHtoBTC(
				intentions.reduce((acc, it) => {
					return acc + (it.evmTransaction?.value ?? 0n);
				}, 0n),
			);

			const transfers: EdictRuneParams["transfers"] = [
				{
					receiver: multisigAddress[config.network.id],
					amount: ensureMoreThanDust(
						Math.ceil(Number(totalCost) + btcTransfer),
					),
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

			let btcTx: EdictRuneResponse | TransferBTCResponse;

			if (runes.length > 0) {
				btcTx = await edictRuneAsync({
					transfers,
					publish: false,
				});
			} else {
				btcTx = await transferBTCAsync({
					transfers: transfers as TransferBTCParams["transfers"],
					publish: false,
				});
			}

			if (shouldComplete) {
				addTxIntention({
					hasWithdraw,
					hasRunesWithdraw,
					evmTransaction: {
						to: executorAddress[config.network.id] as Address,
						gas: 300_000n,
						data: encodeFunctionData({
							abi: executorAbi,
							functionName: "completeTx",
							args: [
								`0x${btcTx.tx.id}`,
								publicKey as `0x${string}`,
								assetsToWithdraw ?? [],
								new Array(assetsToWithdraw?.length ?? 0).fill(0n),
							],
						}),
						chainId,
					},
				});
			}

			return btcTx;
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
				gasPrice,
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
		btcTransaction: data,
		...rest,
	};
};
