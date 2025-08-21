import type { Config } from "@midl/core";
import {
	type TransactionIntention,
	addCompleteTxIntention,
} from "@midl/executor";
import {
	type MidlContextStore,
	useConfigInternal,
	useStoreInternal,
} from "@midl/react";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

type UseAddCompleteTxIntentionParams = {
	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
	/**
	 * Custom store to override the default.
	 */
	store?: MidlContextStore;

	mutation?: Omit<
		UseMutationOptions<
			TransactionIntention,
			Error,
			AddCompleteTxIntentionVariables
		>,
		"mutationFn"
	>;
};

type AddCompleteTxIntentionVariables =
	| Parameters<typeof addCompleteTxIntention>[1]
	// biome-ignore lint/suspicious/noConfusingVoidType: This is used to allow the function to be called without parameters.
	| void;
/**
 * Adds a complete transaction intention using the provided parameters.
 *
 * This hook wraps `addCompleteTxIntention` and stores the resulting intention in the context store.
 *
 * @param params - Optional parameters to override the default config or store.
 * @returns An object with `addCompleteTxIntention`, `addCompleteTxIntentionAsync`, and mutation state from React Query.
 *
 * @example
 * const { addCompleteTxIntention } = useAddCompleteTxIntention();
 * addCompleteTxIntention({ assetsToWithdraw: [address1, address2] });
 */
export const useAddCompleteTxIntention = ({
	store: customStore,
	config: customConfig,
	mutation,
}: UseAddCompleteTxIntentionParams = {}) => {
	const store = useStoreInternal(customStore);
	const config = useConfigInternal(customConfig);

	const { mutate, mutateAsync, ...rest } = useMutation<
		TransactionIntention,
		Error,
		AddCompleteTxIntentionVariables
	>({
		mutationFn: async (withdraw) => {
			const intention = await addCompleteTxIntention(
				config,
				withdraw ?? undefined,
			);

			store.setState((state) => {
				return {
					intentions: [...(state.intentions || []), intention],
				};
			});

			return intention;
		},
		...mutation,
	});

	return {
		addCompleteTxIntention: mutate,
		addCompleteTxIntentionAsync: mutateAsync,
		...rest,
	};
};
