import { type GetFeeRateResponse, getFeeRate } from "@midl-xyz/midl-js-core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

type QueryOptions = Omit<
	UseQueryOptions<GetFeeRateResponse>,
	"queryFn" | "queryKey"
> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseFeeRateParams = {
	query?: QueryOptions;
};

/**
 * Custom hook to retrieve the current fee rate.
 *
 * This hook fetches the latest fee rate from the configured network.
 *
 * @example
 * ```typescript
 * const { feeRate, isLoading } = useFeeRate();
 * ```
 *
 * @param {UseFeeRateParams} [params] - Configuration options for the query.
 *
 * @returns
 * - **feeRate**: `GetFeeRateResponse | undefined` – The current fee rate.
 * - **isLoading**: `boolean` – Indicates if the query is currently loading.
 * - **error**: `Error | null` – Contains error information if the query failed.
 * - **isFetching**: `boolean` – Indicates if the query is in the background fetching state.
 */
export const useFeeRate = ({
	query: { queryKey, ...query } = {} as QueryOptions,
}: UseFeeRateParams = {}) => {
	const config = useConfig();

	return useQuery({
		queryKey: ["feeRate", ...(queryKey ?? [])],
		queryFn: async () => {
			return getFeeRate(config);
		},
		...query,
	});
};
