import { type Config, getBlockNumber } from "@midl/core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useConfigInternal } from "~/hooks/useConfigInternal";

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
	/**
	 * Query options for react-query.
	 */
	query?: QueryOptions;
	/**
	 * Config object to use instead of the one from context.
	 */
	config?: Config;
};

// TODO: Add websocket support

/**
 * Fetches the latest block number from the configured network and can optionally poll for updates at a specified interval.
 *
 * @example
 * ```typescript
 * const { blockNumber, isLoading } = useBlockNumber({ watch: true, pollingInterval: 60000 });
 * ```
 *
 * @param params - Configuration options for fetching the block number.
 *
 * @returns
 * - **blockNumber**: `number | undefined` – The current block number.
 */
export const useBlockNumber = ({
	watch,
	pollingInterval = 30_000,
	query: { queryKey, ...query } = {} as QueryOptions,
	config: customConfig,
}: UseBlockNumberParams = {}) => {
	const config = useConfigInternal(customConfig);

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
