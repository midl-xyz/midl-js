import { useMidlContext } from "~/context";
import { getBlockNumber } from "@midl-xyz/midl-js-core";
import { type QueryOptions, useQuery } from "@tanstack/react-query";

type UseBlockNumberParams = {
    /**
     * If true, the block number will be polled at the specified interval.
     */
	watch?: boolean;
    /**
     * The interval in milliseconds at which to poll the block number.
     */
	pollingInterval?: number;
    query?: Omit<QueryOptions<number>, 'queryFn'>
};

// TODO: Add websocket support

export const useBlockNumber = ({
	watch,
	pollingInterval = 30_000,
    query = {},
}: UseBlockNumberParams = {}) => {
	const { config } = useMidlContext();

	const { data, ...rest } = useQuery({
		queryKey: ["blockNumber"],
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
