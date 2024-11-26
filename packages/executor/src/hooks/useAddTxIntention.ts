import { useMidlContext } from "@midl-xyz/midl-js-react";
import { useMutation } from "@tanstack/react-query";
import type { TransactionSerializableBTC } from "viem";
import { useStore } from "zustand";

type UseAddTxIntentionVariables = {
	// TODO: figure out if type is correct enough
	tx: Omit<TransactionSerializableBTC, "chainId">;
	reset?: boolean;
};

export const useAddTxIntention = () => {
	const { store } = useMidlContext();
	const { intentions = [] } = useStore(store);

	const { mutate, mutateAsync, ...rest } = useMutation<
		Omit<TransactionSerializableBTC, "chainId">[],
		Error,
		UseAddTxIntentionVariables
	>({
		onSuccess: (data) => {
			store.setState((state) => ({
				...state,
				intentions: data,
			}));
		},
		mutationFn: async ({ tx, reset = false }) => {
			const { intentions = [] } = store.getState();
			if (intentions?.length === 10) {
				throw new Error("Maximum number of intentions reached");
			}

			return reset ? [tx] : [...intentions, tx];
		},
	});

	return {
		addTxIntention: mutate,
		addTxIntentionAsync: mutateAsync,
		txIntentions: intentions,
		...rest,
	};
};
