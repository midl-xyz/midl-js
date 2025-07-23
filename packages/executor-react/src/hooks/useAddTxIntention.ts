import type { TransactionIntention } from "@midl-xyz/midl-js-executor";
import {
	type MidlContextStore,
	useStore,
	useStoreInternal,
} from "@midl-xyz/midl-js-react";
import { useMutation } from "@tanstack/react-query";

type UseAddTxIntentionParams = {
	store?: MidlContextStore;
};

type AddTxIntentionVariables = {
	intention: TransactionIntention;
	/**
	 * If true, the array of intentions will be cleared before adding the new one
	 */
	reset?: boolean;
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
export const useAddTxIntention = ({
	store: customStore,
}: UseAddTxIntentionParams = {}) => {
	const store = useStoreInternal(customStore);
	const { intentions = [] } = useStore(customStore);

	const { mutate, mutateAsync, ...rest } = useMutation({
		mutationFn: async ({ reset, intention }: AddTxIntentionVariables) => {
			store.setState((state) => {
				return {
					intentions: reset
						? [intention]
						: [...(state.intentions || []), intention],
				};
			});

			return intention;
		},
	});

	return {
		addTxIntention: mutate,
		addTxIntentionAsync: mutateAsync,
		txIntentions: intentions,
		...rest,
	};
};
