import {
	type Config,
	type SignPSBTParams,
	type SignPSBTResponse,
	signPSBT,
} from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type SignPSBTVariables = SignPSBTParams;

type SignPSBTError = Error;

type SignPSBTData = SignPSBTResponse;

type UseSignPSBTParams = {
	mutation?: Omit<
		UseMutationOptions<SignPSBTData, SignPSBTError, SignPSBTVariables>,
		"mutationFn"
	>;
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
 * signPSBT({ --parameters-- });
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
