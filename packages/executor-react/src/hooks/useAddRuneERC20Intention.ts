import type { Config } from "@midl/core";
import { addRuneERC20Intention } from "@midl/executor";
import {
	type MidlContextStore,
	useConfigInternal,
	useStoreInternal,
} from "@midl/react";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

type AddRuneERC20IntentionResponse = Awaited<
	ReturnType<typeof addRuneERC20Intention>
>;

type UseAddRuneERC20Params = {
	config?: Config;

	store?: MidlContextStore;
	/**
	 * Mutation options for React Query.
	 */
	mutation?: Omit<
		UseMutationOptions<
			AddRuneERC20IntentionResponse,
			Error,
			AddRuneERC20IntentionVariables
		>,
		"mutationFn"
	>;
};

type AddRuneERC20IntentionVariables = {
	/**
	 * The name or ID of the Rune to be added.
	 */
	runeId: string;

	/**
	 * If true, the array of intentions will be cleared before adding the new one
	 */
	reset?: boolean;
};

/**
 * Adds a Rune to the Midl network.
 * Transfers the minting fee and the Rune to the multisig address.
 *
 * @param params - Optional parameters to override the default config or store.
 *
 * @returns The created transaction intention.
 *
 * @example
 * const { addRuneERC20 } = useAddRuneERC20Intention();
 * addRuneERC20({ runeId: "840000:1", reset: true });
 */
export const useAddRuneERC20Intention = ({
	config: customConfig,
	store: customStore,
	mutation,
}: UseAddRuneERC20Params = {}) => {
	const config = useConfigInternal(customConfig);
	const store = useStoreInternal(customStore);

	const { mutate, mutateAsync, ...rest } = useMutation({
		mutationFn: async ({ runeId, reset }: AddRuneERC20IntentionVariables) => {
			const intention = await addRuneERC20Intention(config, runeId);

			store.setState((state) => {
				return {
					intentions: reset
						? [intention]
						: [...(state.intentions || []), intention],
				};
			});

			return intention;
		},
		...mutation,
	});

	return {
		addRuneERC20: mutate,
		addRuneERC20Async: mutateAsync,
		...rest,
	};
};
