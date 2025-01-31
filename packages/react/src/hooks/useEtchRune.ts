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
 * Etches (mints) a new rune on Bitcoin network.
 * *
 * @example
 * ```typescript
 * const { etchRune } = useEtchRune();
 *
 * etchRune({ --parameters-- });
 * ```
 *
 * @param {UseEtchRuneParams} params - Configuration options for the mutation.
 *
 * @returns
 * - **etchRune**: `(variables: EtchRuneVariables) => void` – Function to initiate the Etch Rune action.
 * - **etchRuneAsync**: `(variables: EtchRuneVariables) => Promise<EtchRuneData>` – Function to asynchronously execute the Etch Rune action.
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
