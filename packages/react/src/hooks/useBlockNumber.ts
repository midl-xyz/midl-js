import { getBlockNumber } from "@midl-xyz/midl-js-core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

type QueryOptions = Omit<UseQueryOptions<number>, "queryFn" | "queryKey"> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseBlockNumberParams = {
	/**
	 * If true, the block number will be polled at the specified interval.
	 */
	watch?: boolean;
	/**
	 * The interval in milliseconds at which to poll the block number.
	 */
	pollingInterval?: number;
	query?: QueryOptions;
};

// TODO: Add websocket support

/**
 * Custom hook to retrieve the current block number.
 *
 * This hook fetches the latest block number from the configured network and can optionally poll for updates at a specified interval.
 *
 * @example
 * ```typescript
 * const { blockNumber, isLoading } = useBlockNumber({ watch: true, pollingInterval: 60000 });
 * ```
 *
 * @param {UseBlockNumberParams} params - Configuration options for fetching the block number.
 * @param {boolean} params.watch - If true, the block number is polled at the specified interval.
 * @param {number} [params.pollingInterval=30000] - The interval in milliseconds for polling the block number.
 * @param {QueryOptions} params.query - Additional query options.
 *
 * @returns
 * - **blockNumber**: `number | undefined` – The current block number.
 * - **isLoading**: `boolean` – Indicates if the query is currently loading.
 * - **error**: `Error | null` – Contains error information if the query failed.
 * - **isFetching**: `boolean` – Indicates if the query is in the background fetching state.
 */
export const useBlockNumber = ({
	watch,
	pollingInterval = 30_000,
	query: { queryKey, ...query } = {} as QueryOptions,
}: UseBlockNumberParams = {}) => {
	const config = useConfig();

	const { data, ...rest } = useQuery<number>({
		queryKey: ["blockNumber", ...(queryKey ?? [])],
		queryFn: () => {
			return getBlockNumber(config);
		},
		refetchInterval: watch ? pollingInterval : false,
		...query,
	});

	return {
		blockNumber: data,
		...rest,
	};
};
