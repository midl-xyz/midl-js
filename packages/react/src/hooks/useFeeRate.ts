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
