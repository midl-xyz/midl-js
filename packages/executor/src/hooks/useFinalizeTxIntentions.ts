import type { EdictRuneParams } from "@midl-xyz/midl-js-core";
import { useEdictRune, useMidlContext } from "@midl-xyz/midl-js-react";
import { useMutation } from "@tanstack/react-query";
import { type Client, type StateOverride, parseUnits } from "viem";
import { estimateGasMulti } from "viem/actions";
import { useClient } from "wagmi";
import { useStore } from "zustand";
import { multisigAddress } from "~/config";
import { useLastNonce } from "~/hooks/useLastNonce";
import { usePublicKey } from "~/hooks/usePublicKey";
import { useSignTransaction } from "~/hooks/useSignTransaction";
import type { TransactionIntention } from "~/types/intention";
import { calculateTransactionsCost } from "~/utils";

type UseFinalizeTxIntentionsParams = {
	/**
	 * State override to estimate the cost of the transaction
	 */
	stateOverride?: StateOverride;
};

export const useFinalizeTxIntentions = ({
	stateOverride,
}: UseFinalizeTxIntentionsParams) => {
	const { store, config } = useMidlContext();
	const { intentions = [] } = useStore(store);
	const { edictRuneAsync } = useEdictRune();
	const { signTransactionAsync } = useSignTransaction();
	const publicKey = usePublicKey();
	const publicClient = useClient();
	const nonce = useLastNonce();

	const { mutate, mutateAsync, data, ...rest } = useMutation({
		mutationFn: async () => {
			if (!config.network) {
				throw new Error("No network set");
			}

			const { intentions } = store.getState();

			if (!intentions) {
				throw new Error("No intentions set");
			}

			const gasLimits = await estimateGasMulti(publicClient as Client, {
				transactions: intentions.map((it) => it.evmTransaction),
				stateOverride,
			});

			intentions.forEach((it, i) => {
				it.evmTransaction.gas = gasLimits[i];
			});

			const totalCost = await calculateTransactionsCost(
				intentions.map((it) => it.evmTransaction),
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

			const transfers: EdictRuneParams["transfers"] = [
				{
					receiver: multisigAddress[config.network.id],
					amount: Number(totalCost + btcTransfer),
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

			for (const intention of intentions) {
				intention.evmTransaction = {
					...intention.evmTransaction,
					nonce: nonce + intentions.indexOf(intention),
					gasPrice: parseUnits("1", 3),
					publicKey,
					btcTxHash: `0x${txId}`,
				};
			}

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
