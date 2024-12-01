import {
	type SignPSBTParams,
	type SignPSBTResponse,
	signPSBT,
} from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

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
 * Custom hook to sign a PSBT (Partially Signed Bitcoin Transaction).
 *
 * This hook provides functions to sign a PSBT using the connected wallet.
 *
 * @example
 * ```typescript
 * const { signPSBT, signPSBTAsync } = useSignPSBT();
 * 
 * // To sign a PSBT
 * signPSBT({ --parameters-- });
 * 
 * // To sign a PSBT asynchronously
 * await signPSBTAsync({ --parameters-- });
 * ```
 *
 * @param {UseSignPSBTParams} [params] - Configuration options for the mutation.
 *
 * @returns
 * - `signPSBT`: `(variables: SignPSBTVariables) => void` – Function to initiate PSBT signing.
 * - `signPSBTAsync`: `(variables: SignPSBTVariables) => Promise<SignPSBTData>` – Function to asynchronously sign PSBT.
 * - `isLoading`: `boolean` – Indicates if the mutation is currently loading.
 * - `error`: `Error | null` – Contains error information if the mutation failed.
 * - `data`: `SignPSBTData | undefined` – The response data from the PSBT signing.
 */
export const useSignPSBT = ({ mutation }: UseSignPSBTParams = {}) => {
	const config = useConfig();

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
