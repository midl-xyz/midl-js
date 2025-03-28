import {
	type SignPSBTParams,
	type SignPSBTResponse,
	signPSBT,
} from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type SignPSBTVariables = SignPSBTParams;

type SignPSBTError = Error;

type SignPSBTData = SignPSBTResponse;

type UseSignPSBTParams = {
	mutation?: Omit<
		UseMutationOptions<SignPSBTData, SignPSBTError, SignPSBTVariables>,
		"mutationFn"
	>;
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
export const useSignPSBT = ({ mutation }: UseSignPSBTParams = {}) => {
	const { config } = useMidlContext();

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
