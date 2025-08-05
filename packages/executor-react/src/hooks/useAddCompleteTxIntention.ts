import type { Config } from "@midl-xyz/midl-js-core";
import { addCompleteTxIntention } from "@midl-xyz/midl-js-executor";
import {
	type MidlContextStore,
	useConfigInternal,
	useStoreInternal,
} from "@midl-xyz/midl-js-react";
import { useMutation } from "@tanstack/react-query";
import type { Address } from "viem";

type UseAddCompleteTxIntentionParams = {
	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
	/**
	 * Custom store to override the default.
	 */
	store?: MidlContextStore;
};

type AddCompleteTxIntentionVariables = {
	assetsToWithdraw: [Address] | [Address, Address];
};

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
}: UseAddCompleteTxIntentionParams = {}) => {
	const store = useStoreInternal(customStore);
	const config = useConfigInternal(customConfig);

	const { mutate, mutateAsync, ...rest } = useMutation({
		mutationFn: async ({
			assetsToWithdraw,
		}: AddCompleteTxIntentionVariables) => {
			const intention = await addCompleteTxIntention(config, assetsToWithdraw);

			store.setState((state) => {
				return {
					intentions: [...(state.intentions || []), intention],
				};
			});

			return intention;
		},
	});

	return {
		addCompleteTxIntention: mutate,
		addCompleteTxIntentionAsync: mutateAsync,
		...rest,
	};
};
