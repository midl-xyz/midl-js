import type { Config } from "@midl/core";
import { addRuneERC20 } from "@midl/executor";
import { useConfigInternal } from "@midl/react";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";

type AddRuneERC20Response = Awaited<ReturnType<typeof addRuneERC20>>;

type UseAddRuneERC20Params = {
	config?: Config;
	/**
	 * Mutation options for React Query.
	 */
	mutation?: Omit<
		UseMutationOptions<AddRuneERC20Response, Error, AddRuneERC20Variables>,
		"mutationFn"
	>;
};

type AddRuneERC20Variables = {
	/**
	 * The name or ID of the Rune to be added.
	 */
	runeId: string;

	/**
	 * If true
	 */
	publish?: boolean;
};

/**
 * Adds a Rune to the Midl network.
 * Transfers the minting fee and the Rune to the multisig address.
 *
 * @param params - Optional parameters to override the default config or store.
 *
 * @returns The transaction details including PSBT and transaction hex.
 *
 * @example
 * const { addRuneERC20 } = useAddRuneERC20();
 * addRuneERC20({ runeId: "RUNE1234567890", publish: true });
 */
export const useAddRuneERC20 = ({
	config: customConfig,
	mutation,
}: UseAddRuneERC20Params = {}) => {
	const config = useConfigInternal(customConfig);
	const client = usePublicClient();

	const { mutate, mutateAsync, ...rest } = useMutation({
		mutationFn: async ({ runeId, publish }: AddRuneERC20Variables) => {
			// biome-ignore lint/style/noNonNullAssertion: client is defined
			return addRuneERC20(config, client!, runeId, {
				publish,
			});
		},
		...mutation,
	});

	return {
		addRuneERC20: mutate,
		addRuneERC20Async: mutateAsync,
		...rest,
	};
};
