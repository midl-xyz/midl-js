import { getFeeRate, type GetFeeRateResponse } from "@midl-xyz/midl-js-core";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
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
