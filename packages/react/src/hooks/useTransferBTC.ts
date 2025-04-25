import {
	type TransferBTCParams,
	type TransferBTCResponse,
	transferBTC,
} from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useMidlContext } from "~/context";
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

/**
 *	Transfers BTC
 * *
 * @example
 * ```typescript
 * const { transferBTC, transferBTCAsync } = useTransferBTC();
 *
 * transferBTC({  --parameters--  });
 * ```
 *
 * @param params Configuration options for the mutation.
 *
 * @returns
 * - `transferBTC`: `(variables: TransferBTCVariables) => void` – Function to initiate a BTC transfer.
 * - `transferBTCAsync`: `(variables: TransferBTCVariables) => Promise<TransferBTCData>` – Function to asynchronously transfer BTC.
 */

export const useTransferBTC = ({ mutation }: UseTransferBTCParams = {}) => {
	const { config } = useMidlContext();

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
