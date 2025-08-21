import {
	type Config,
	type TransferBTCParams,
	type TransferBTCResponse,
	transferBTC,
} from "@midl/core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type TransferBTCVariables = TransferBTCParams;

type TransferBTCError = Error;

type TransferBTCData = TransferBTCResponse;

type UseTransferBTCParams = {
	/**
	 * Mutation options for the transfer BTC operation.
	 */
	mutation?: Omit<
		UseMutationOptions<TransferBTCData, TransferBTCError, TransferBTCVariables>,
		"mutationFn"
	>;
	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
};

/**
 *	Transfers BTC
 * *
 * @example
 * ```typescript
 * const { transferBTC, transferBTCAsync } = useTransferBTC();
 *
 * transferBTC({  ...parameters });
 * ```
 *
 * @param params Configuration options for the mutation.
 *
 * @returns
 * - `transferBTC`: `(variables: TransferBTCVariables) => void` – Function to initiate a BTC transfer.
 * - `transferBTCAsync`: `(variables: TransferBTCVariables) => Promise<TransferBTCData>` – Function to asynchronously transfer BTC.
 */

export const useTransferBTC = ({
	mutation,
	config: customConfig,
}: UseTransferBTCParams = {}) => {
	const config = useConfigInternal(customConfig);

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
