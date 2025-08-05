import {
	type Config,
	type EdictRuneParams,
	type EdictRuneResponse,
	edictRune,
} from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type EdictRuneVariables = EdictRuneParams;

type EdictRuneError = Error;

type EdictRuneData = EdictRuneResponse;

type UseEdictRuneParams = {
	/**
	 * Mutation options for react-query.
	 */
	mutation?: Omit<
		UseMutationOptions<EdictRuneData, EdictRuneError, EdictRuneVariables>,
		"mutationFn"
	>;
	/**
	 * Config object to use instead of the one from context.
	 */
	config?: Config;
};

/**
 * Edicts (transfers) one or more runes to one or more receivers.
 *
 * @example
 * ```typescript
 * const { edictRune, edictRuneAsync } = useEdictRune();
 *
 * edictRune({ ...parameters });
 * ```
 *
 * @param {UseEdictRuneParams} [params] - Configuration options for the mutation.
 *
 * @returns
 * - **edictRune**: `(variables: EdictRuneVariables) => void` – Function to initiate the Edict Rune action.
 * - **edictRuneAsync**: `(variables: EdictRuneVariables) => Promise<EdictRuneData>` – Function to asynchronously execute the Edict Rune action.
 **/
export const useEdictRune = ({
	mutation,
	config: customConfig,
}: UseEdictRuneParams = {}) => {
	const config = useConfigInternal(customConfig);
	const { mutationKey = [], ...mutationParams } = mutation ?? {};

	const { mutate, mutateAsync, ...rest } = useMutation<
		EdictRuneData,
		EdictRuneError,
		EdictRuneVariables
	>({
		mutationKey: ["edictRune", ...mutationKey],
		mutationFn: async (params) => {
			return edictRune(config, params);
		},
		...mutationParams,
	});

	return {
		edictRune: mutate,
		edictRuneAsync: mutateAsync,
		...rest,
	};
};
