import {
	type Config,
	type SignPSBTParams,
	type SignPSBTResponse,
	signPSBT,
} from "@midl/core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type SignPSBTVariables = SignPSBTParams;

/**
 * Signs a PSBT with the given parameters. Optionally, it can broadcast the transaction.
 *
 * @example
 * ```typescript
 * const { signPSBT, signPSBTAsync } = useSignPSBT();
 *
 * signPSBT({ psbt: 'cHNidP8BAHECAAAA...', signInputs: { ... }, publish: true });
 * ```
 *
 * @param params Configuration options for the mutation.
 *
 * @returns
 * - `signPSBT`: `(variables: SignPSBTVariables) => void` – Function to initiate PSBT signing.
 * - `signPSBTAsync`: `(variables: SignPSBTVariables) => Promise<SignPSBTData>` – Function to asynchronously sign PSBT.
 * - `...rest`: Additional mutation state (e.g. isLoading, error, etc.).
 */
type SignPSBTError = Error;

type SignPSBTData = SignPSBTResponse;

type UseSignPSBTParams = {
	/**
	 * Mutation options for the sign PSBT operation.
	 */
	mutation?: Omit<
		UseMutationOptions<SignPSBTData, SignPSBTError, SignPSBTVariables>,
		"mutationFn"
	>;
	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
};

/**
 * Sign a PSBT
 *
 *
 * @example
 * ```typescript
 * const { signPSBT, signPSBTAsync } = useSignPSBT();
 *
 * // To sign a PSBT
 * signPSBT({ ...parameters });
 * ```
 *
 * @param params Configuration options for the mutation.
 *
 * @returns
 * - `signPSBT`: `(variables: SignPSBTVariables) => void` – Function to initiate PSBT signing.
 * - `signPSBTAsync`: `(variables: SignPSBTVariables) => Promise<SignPSBTData>` – Function to asynchronously sign PSBT.
 */
export const useSignPSBT = ({
	mutation,
	config: customConfig,
}: UseSignPSBTParams = {}) => {
	const config = useConfigInternal(customConfig);

	const { mutate, mutateAsync, ...rest } = useMutation<
		SignPSBTData,
		SignPSBTError,
		SignPSBTVariables
	>({
		mutationFn: async (params) => {
			return signPSBT(config, params);
		},
		...mutation,
	});

	return {
		signPSBT: mutate,
		signPSBTAsync: mutateAsync,
		...rest,
	};
};
