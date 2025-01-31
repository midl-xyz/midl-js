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
