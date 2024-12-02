import {
	type EdictRuneParams,
	type EdictRuneResponse,
	edictRune,
} from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

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
 * Custom hook to execute the Edict Rune action.
 *
 * This hook provides functions to perform the Edict Rune operation, handling the mutation state.
 *
 * @example
 * ```typescript
 * const { edictRune, edictRuneAsync } = useEdictRune();
 * 
 * // To execute Edict Rune
 * edictRune({ --parameters-- });
 * 
 * // To execute Edict Rune asynchronously
 * 
 * await edictRuneAsync({ --parameters-- });
 * ```
 *
 * @param {UseEdictRuneParams} [params] - Configuration options for the mutation.
 *
 * @returns
 * - **edictRune**: `(variables: EdictRuneVariables) => void` – Function to initiate the Edict Rune action.
 * - **edictRuneAsync**: `(variables: EdictRuneVariables) => Promise<EdictRuneData>` – Function to asynchronously execute the Edict Rune action.
 * - **isLoading**: `boolean` – Indicates if the mutation is currently loading.
 * - **error**: `Error | null` – Contains error information if the mutation failed.
 * - **data**: `EdictRuneData | undefined` – The response data from the Edict Rune action.
 **/
export const useEdictRune = ({ mutation }: UseEdictRuneParams = {}) => {
	const config = useConfig();
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
