import {
	type EdictRuneParams,
	type EdictRuneResponse,
	edictRune,
} from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type EdictRuneVariables = EdictRuneParams;

type EdictRuneError = Error;

type EdictRuneData = EdictRuneResponse;

type UseEdictRuneParams = {
	mutation?: Omit<
		UseMutationOptions<EdictRuneData, EdictRuneError, EdictRuneVariables>,
		"mutationFn"
	>;
};

/*
 * Edicts (transfers) one or more runes to one or more receivers
 * *
 * @example
 * ```typescript
 * const { edictRune, edictRuneAsync } = useEdictRune();
 *
 * edictRune({ --parameters-- });
 * ```
 *
 * @param {UseEdictRuneParams} [params] - Configuration options for the mutation.
 *
 * @returns
 * - **edictRune**: `(variables: EdictRuneVariables) => void` – Function to initiate the Edict Rune action.
 * - **edictRuneAsync**: `(variables: EdictRuneVariables) => Promise<EdictRuneData>` – Function to asynchronously execute the Edict Rune action.
 **/
export const useEdictRune = ({ mutation }: UseEdictRuneParams = {}) => {
	const { config } = useMidlContext();
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
