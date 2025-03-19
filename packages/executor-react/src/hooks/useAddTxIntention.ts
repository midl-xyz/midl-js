import {
	type PartialIntention,
	addTxIntention,
} from "@midl-xyz/midl-js-executor";
import { useMidlContext, useStore } from "@midl-xyz/midl-js-react";
import { useMutation } from "@tanstack/react-query";

type AddTxIntentionVariables = {
	intention: PartialIntention;
	/**
	 * If true, the array of intentions will be cleared before adding the new one
	 */
	reset?: boolean;
	publicKey?: string;
};

/**
 * Custom hook to add a transaction intention.
 *
 * This hook provides a function to add a new transaction intention to the store,
 * enforcing constraints such as the maximum number of intentions and limiting runes deposits.
 *
 * @example
 * ```typescript
 *
 * const { addTxIntention, addTxIntentionAsync, txIntentions, isLoading } = useAddTxIntention();
 *
 * const intention = {
 *    // Intention object
 * };
 *
 * addTxIntention(intention);
 * ```
 *
 * @returns `AddTxIntentionResponse` – The response object containing the mutation function and the current transaction intentions.
 */
export const useAddTxIntention = () => {
	const { store } = useMidlContext();
	const { intentions = [] } = useStore();
	const { config } = useMidlContext();

	const { mutate, mutateAsync, ...rest } = useMutation({
		mutationFn: ({ reset, publicKey, intention }: AddTxIntentionVariables) => {
			return addTxIntention(config, store, intention, reset, publicKey);
		},
	});

	return {
		addTxIntention: mutate,
		addTxIntentionAsync: mutateAsync,
		txIntentions: intentions,
		...rest,
	};
};
