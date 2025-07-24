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
	config?: Config;
	store?: MidlContextStore;
};

type AddCompleteTxIntentionVariables = {
	assetsToWithdraw: [Address] | [Address, Address];
};

/**
 * Custom hook to add a complete transaction intention.
 *
 *
 * @example
 * ```typescript
 *
 * const { addCompleteTxIntention } = useAddCompleteTxIntention();
 *
 *
 * addCompleteTxIntention({
 *  assetsToWithdraw: [address1, address2],
 * });
 * ```
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
