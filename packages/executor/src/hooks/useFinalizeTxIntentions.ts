import type { EdictRuneParams } from "@midl-xyz/midl-js-core";
import { useEdictRune, useMidlContext } from "@midl-xyz/midl-js-react";
import { useMutation } from "@tanstack/react-query";
import type { Client, StateOverride } from "viem";
import { estimateGasMulti } from "viem/actions";
import { useClient } from "wagmi";
import { useStore } from "zustand";
import { multisigAddress } from "~/config";
import { useLastNonce } from "~/hooks/useLastNonce";
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

			const transfers: EdictRuneParams["transfers"] = [
				{
					receiver: multisigAddress[config.network.id],
					amount: Number(totalCost),
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

			if (runes.length > 1) {
				throw new Error("Transferring more than one rune is not yet supported");
			}

			if (runes[0]) {
				transfers.push({
					receiver: multisigAddress[config.network.id],
					amount: runes[0].value,
					runeId: runes[0].id,
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
		mutationFn: async (intention: TransactionIntention) => {
			if (!data) {
				throw new Error("Finalize BTC transaction first");
			}

			const signed = await signTransactionAsync({
				tx: {
					...intention.evmTransaction,
					nonce: nonce + intentions.indexOf(intention),
					btcTxHash: `0x${data.tx.id}`,
				},
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
