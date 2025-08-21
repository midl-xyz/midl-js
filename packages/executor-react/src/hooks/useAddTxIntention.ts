import type { Config } from "@midl/core";
import { type PartialIntention, addTxIntention } from "@midl/executor";
import {
	type MidlContextStore,
	useConfigInternal,
	useStore,
	useStoreInternal,
} from "@midl/react";
import { useMutation } from "@tanstack/react-query";

type UseAddTxIntentionParams = {
	config?: Config;
	store?: MidlContextStore;
};

type AddTxIntentionVariables = {
	intention: PartialIntention;
	/**
	 * If true, the array of intentions will be cleared before adding the new one
	 */
	reset?: boolean;
	/**
	 * BTC address to use for the intention
	 */
	from?: string;
};

/**
 * Adds a transaction intention using the provided parameters.
 *
 * This utility wraps `addTxIntention` and stores the resulting intention in the context store.
 *
 * @param params - Optional parameters to override the default config or store.
 * @returns An object with `addTxIntention`, `addTxIntentionAsync`, `txIntentions`, and mutation state from React Query.
 *
 * @example
 * const { addTxIntention } = useAddTxIntention();
 * addTxIntention({ intention });
 */
export const useAddTxIntention = ({
	store: customStore,
	config: customConfig,
}: UseAddTxIntentionParams = {}) => {
	const store = useStoreInternal(customStore);
	const config = useConfigInternal(customConfig);
	const { intentions = [] } = useStore(customStore);

	const { mutate, mutateAsync, ...rest } = useMutation({
		mutationFn: async ({ reset, from, intention }: AddTxIntentionVariables) => {
			const intentionToAdd = await addTxIntention(config, intention, from);

			store.setState((state) => {
				return {
					intentions: reset
						? [intentionToAdd]
						: [...(state.intentions || []), intentionToAdd],
				};
			});

			return intentionToAdd;
		},
	});

	return {
		addTxIntention: mutate,
		addTxIntentionAsync: mutateAsync,
		txIntentions: intentions,
		...rest,
	};
};
