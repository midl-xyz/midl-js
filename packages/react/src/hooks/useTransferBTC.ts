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

/**
 * Custom hook to transfer Bitcoin (BTC).
 *
 * This hook provides functions to initiate a BTC transfer and handle its asynchronous operation.
 *
 * @example
 * ```typescript
 * const { transferBTC, transferBTCAsync } = useTransferBTC();
 * 
 * // To transfer BTC
 * transferBTC({  --parameters--  });
 * 
 * // To transfer BTC asynchronously
 * await transferBTCAsync({ --parameters-- });
 * ```
 *
 * @param {UseTransferBTCParams} [params] - Configuration options for the mutation.
 *
 * @returns
 * - `transferBTC`: `(variables: TransferBTCVariables) => void` – Function to initiate a BTC transfer.
 * - `transferBTCAsync`: `(variables: TransferBTCVariables) => Promise<TransferBTCData>` – Function to asynchronously transfer BTC.
 * - `isLoading`: `boolean` – Indicates if the mutation is currently loading.
 * - `error`: `Error | null` – Contains error information if the mutation failed.
 * - `data`: `TransferBTCData | undefined` – The response data from the BTC transfer.
 */


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
