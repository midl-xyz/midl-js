import { type Config, type EtchRuneParams, etchRune } from "@midl/core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type EtchRuneData = Awaited<ReturnType<typeof etchRune>>;
type EtchRuneError = Error;
type EtchRuneVariables = EtchRuneParams;

type UseEtchRuneParams = {
	/**
	 * Mutation options for the etch rune operation.
	 */
	mutation?: Omit<
		UseMutationOptions<EtchRuneData, EtchRuneError, EtchRuneVariables>,
		"mutationFn"
	>;
	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
};

/**
 * Etches (mints) a new rune on Bitcoin network.
 * *
 * @example
 * ```typescript
 * const { etchRune } = useEtchRune();
 *
 * etchRune({ ...parameters });
 * ```
 *
 * @param {UseEtchRuneParams} params - Configuration options for the mutation.
 *
 * @returns
 * - **etchRune**: `(variables: EtchRuneVariables) => void` – Function to initiate the Etch Rune action.
 * - **etchRuneAsync**: `(variables: EtchRuneVariables) => Promise<EtchRuneData>` – Function to asynchronously execute the Etch Rune action.
 */
export const useEtchRune = ({
	mutation: mutationParams,
	config: customConfig,
}: UseEtchRuneParams) => {
	const config = useConfigInternal(customConfig);

	const mutation = useMutation<EtchRuneData, EtchRuneError, EtchRuneVariables>({
		mutationFn: (params) => {
			return etchRune(config, params);
		},
		...mutationParams,
	});

	return {
		etchRune: mutation.mutate,
		etchRuneAsync: mutation.mutateAsync,
		...mutation,
	};
};
