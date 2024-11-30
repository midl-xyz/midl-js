import {
	type TransferBTCParams,
	type TransferBTCResponse,
	transferBTC,
} from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

type TransferBTCVariables = TransferBTCParams;

type TransferBTCError = Error;

type TransferBTCData = TransferBTCResponse;

type UseTransferBTCParams = {
	mutation?: Omit<
		UseMutationOptions<TransferBTCData, TransferBTCError, TransferBTCVariables>,
		"mutationFn"
	>;
};

export const useTransferBTC = ({ mutation }: UseTransferBTCParams = {}) => {
	const config = useConfig();

	const { mutationKey = [], ...mutationParams } = mutation ?? {};

	const { mutate, mutateAsync, ...rest } = useMutation<
		TransferBTCData,
		TransferBTCError,
		TransferBTCVariables
	>({
		mutationKey: ["transferBTC", ...mutationKey],
		mutationFn: async (params) => {
			return transferBTC(config, params);
		},
		...mutationParams,
	});

	return {
		transferBTC: mutate,
		transferBTCAsync: mutateAsync,
		...rest,
	};
};
