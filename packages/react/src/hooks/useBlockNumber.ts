import { useMidlContext } from "~/context";
import { getBlockNumber } from "@midl-xyz/midl-js-core";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

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

export const useBlockNumber = ({
	watch,
	pollingInterval = 30_000,
	query: { queryKey, ...query } = {} as QueryOptions,
}: UseBlockNumberParams = {}) => {
	const { config } = useMidlContext();

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
