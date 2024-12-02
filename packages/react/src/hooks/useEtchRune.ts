import { type EtchRuneParams, etchRune } from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

type EtchRuneData = Awaited<ReturnType<typeof etchRune>>;
type EtchRuneError = Error;
type EtchRuneVariables = EtchRuneParams;

type UseEtchRuneParams = {
	mutation?: Omit<
		UseMutationOptions<EtchRuneData, EtchRuneError, EtchRuneVariables>,
		"mutationFn"
	>;
};

/**
 * Custom hook to execute the Etch Rune action.
 *
 * This hook provides functions to perform the Etch Rune operation, handling the mutation state.
 *
 * @example
 * ```typescript
 * const { etchRune, etchRuneAsync } = useEtchRune();
 * 
 * // To execute Etch Rune
 * etchRune({ --parameters-- });
 * 
 * // To execute Etch Rune asynchronously
 * await etchRuneAsync({ --parameters-- });
 * ```
 *
 * @param {UseEtchRuneParams} params - Configuration options for the mutation.
 *
 * @returns
 * - **etchRune**: `(variables: EtchRuneVariables) => void` – Function to initiate the Etch Rune action.
 * - **etchRuneAsync**: `(variables: EtchRuneVariables) => Promise<EtchRuneData>` – Function to asynchronously execute the Etch Rune action.
 * - **isLoading**: `boolean` – Indicates if the mutation is currently loading.
 * - **error**: `Error | null` – Contains error information if the mutation failed.
 * - **data**: `EtchRuneData | undefined` – The response data from the Etch Rune action.
 */
export const useEtchRune = (params: UseEtchRuneParams) => {
	const config = useConfig();

	const mutation = useMutation<EtchRuneData, EtchRuneError, EtchRuneVariables>({
		mutationFn: (params) => {
			return etchRune(config, params);
		},
		...params.mutation,
	});

	return {
		etchRune: mutation.mutate,
		etchRuneAsync: mutation.mutateAsync,
		...mutation,
	};
};
