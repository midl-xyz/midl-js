import type { Config } from "@midl/core";
import {
	type EstimateBTCTransactionOptions,
	type EstimateBTCTransactionResponse,
	estimateBTCTransaction,
	type TransactionIntention,
} from "@midl/executor";
import { useConfig, useConfigInternal } from "@midl/react";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { safeJSONStringify } from "~/utils";

type QueryOptions = Omit<
	UseQueryOptions<EstimateBTCTransactionResponse>,
	"queryFn" | "queryKey"
> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseEstimateBTCTransactionParams = EstimateBTCTransactionOptions & {
	query?: QueryOptions;
	config?: Config;
};

/**
 * Estimates the cost and gas requirements for a Bitcoin transaction with the provided intentions. Calculates gas limits for EVM transactions and total fees without executing the transaction.
 */
export const useEstimateBTCTransaction = (
	intentions: TransactionIntention[],
	{
		query,
		config: customConfig,
		...options
	}: UseEstimateBTCTransactionParams = {},
) => {
	const config = useConfigInternal(customConfig);
	const { network } = useConfig(customConfig);
	const client = usePublicClient();

	return useQuery({
		queryKey: [
			"estimateBTCTransaction",
			safeJSONStringify(intentions),
			...(query?.queryKey ?? []),
		],
		queryFn: () => {
			// biome-ignore lint/style/noNonNullAssertion: client is defined
			return estimateBTCTransaction(config, intentions, client!, options);
		},
		enabled:
			typeof query?.enabled === "boolean"
				? query.enabled
				: Boolean(network) && intentions.length > 0,
		...query,
	});
};
