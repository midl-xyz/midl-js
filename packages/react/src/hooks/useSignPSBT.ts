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
