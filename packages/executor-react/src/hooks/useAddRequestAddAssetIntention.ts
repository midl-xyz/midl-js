import type { Config } from "@midl/core";
import {
	type AddRequestAddAssetIntentionParams,
	addRequestAddAssetIntention,
} from "@midl/executor";
import {
	type MidlContextStore,
	useConfigInternal,
	useStoreInternal,
} from "@midl/react";
import { useMutation } from "@tanstack/react-query";

type UseAddRequestAddAssetIntentionParams = {
	config?: Config;
	store?: MidlContextStore;
};

type AddRequestAddAssetIntentionVariables = {
	reset?: boolean;
	/**
	 * BTC address to use for the intention
	 */
	from?: string;
} & AddRequestAddAssetIntentionParams;

/**
 * Adds a request to add asset intention using the provided parameters.
 *
 * This utility wraps `addRequestAddAssetIntention` and stores the resulting intention in the context store.
 *
 * @param params - Optional parameters to override the default config or store.
 */
export const useAddRequestAddAssetsIntention = ({
	store: customStore,
	config: customConfig,
}: UseAddRequestAddAssetIntentionParams = {}) => {
	const store = useStoreInternal(customStore);
	const config = useConfigInternal(customConfig);

	const { mutate, mutateAsync, ...rest } = useMutation({
		mutationFn: async ({
			reset,
			from,
			runeId,
			address,
			amount,
		}: AddRequestAddAssetIntentionVariables) => {
			const intentionToAdd = await addRequestAddAssetIntention(
				config,
				{
					runeId,
					address,
					amount,
				},
				{ from },
			);

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
		addRequestAddAssetIntention: mutate,
		addRequestAddAssetIntentionAsync: mutateAsync,
		...rest,
	};
};
