import {
	type Config,
	type FeeRateResponse,
	getFeeRate,
} from "@midl-xyz/midl-js-core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type QueryOptions = Omit<
	UseQueryOptions<FeeRateResponse>,
	"queryFn" | "queryKey"
> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseFeeRateParams = {
	/**
	 * Optional query options for the fee rate operation.
	 */
	query?: QueryOptions;
	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
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
	config: customConfig,
}: UseFeeRateParams = {}) => {
	const config = useConfigInternal(customConfig);

	return useQuery({
		queryKey: ["feeRate", ...(queryKey ?? [])],
		queryFn: async () => {
			return getFeeRate(config);
		},
		...query,
	});
};
