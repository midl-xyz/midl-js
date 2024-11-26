import { useMidlContext } from "@midl-xyz/midl-js-react";
import { useMutation } from "@tanstack/react-query";
import type { TransactionSerializableBTC } from "viem";

async function calculateTxCost(
	tx: Omit<TransactionSerializableBTC, "chainId">,
) {
	return 100_000n;
}

export const useFinalizeTxIntentions = () => {
	const { store } = useMidlContext();

	const { mutate, mutateAsync, ...rest } = useMutation({
		mutationFn: async () => {
			const { intentions } = store.getState();

			const totalCost = intentions?.map((it) => calculateTxCost(it));

			if (!totalCost) {
				throw new Error("Unable to calculate transaction cost");
			}

			// Build btc transaction

			// ideally we have to sign all the transactions at once.
			// if we can't sign all the transactions at once we need to have something like and indicator of signage.
			// probably we can modify somehow useMutation to return partial signage process.
			// the idea is that developer can trigger each transaction signage separately
		},
	});

	return {
		finalizeTxIntentions: mutate,
		finalizeTxIntentionsAsync: mutateAsync,
		...rest,
	};
};
