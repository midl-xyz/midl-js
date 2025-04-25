import { type GetFeeRateResponse, getFeeRate } from "@midl-xyz/midl-js-core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

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
 * Gets the current fee rate.
 *
 * @example
 * ```typescript
 * const { feeRate, isLoading } = useFeeRate();
 * ```
 *
 * @param params Configuration options for the query.
 *
 * @returns
 * - **feeRate**: `GetFeeRateResponse | undefined` – The current fee rate.
 */
export const useFeeRate = ({
	query: { queryKey, ...query } = {} as QueryOptions,
}: UseFeeRateParams = {}) => {
	const { config } = useMidlContext();

	return useQuery({
		queryKey: ["feeRate", ...(queryKey ?? [])],
		queryFn: async () => {
			return getFeeRate(config);
		},
		...query,
	});
};
