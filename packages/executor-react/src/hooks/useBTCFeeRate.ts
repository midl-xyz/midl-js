import type { Config } from "@midl/core";
import { type GetBTCFeeRateResponse, getBTCFeeRate } from "@midl/executor";
import { useConfig, useConfigInternal } from "@midl/react";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";

type QueryOptions = Omit<
	UseQueryOptions<GetBTCFeeRateResponse>,
	"queryFn" | "queryKey"
> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseBTCFeeRateParams = {
	query?: QueryOptions;
	config?: Config;
};

export const useBTCFeeRate = ({
	query,
	config: customConfig,
}: UseBTCFeeRateParams = {}) => {
	const config = useConfigInternal(customConfig);
	const { network } = useConfig(customConfig);
	const client = usePublicClient();

	return useQuery({
		queryKey: ["btcFeeRate", ...(query?.queryKey ?? [])],
		queryFn: () => {
			// biome-ignore lint/style/noNonNullAssertion: client is defined
			return getBTCFeeRate(config, client!);
		},
		enabled:
			typeof query?.enabled === "boolean" ? query.enabled : Boolean(network),
		...query,
	});
};
