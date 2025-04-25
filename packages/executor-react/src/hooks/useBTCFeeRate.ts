import {
	type GetBTCFeeRateResponse,
	getBTCFeeRate,
} from "@midl-xyz/midl-js-executor";
import { useConfig, useMidlContext } from "@midl-xyz/midl-js-react";
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
};

export const useBTCFeeRate = ({ query }: UseBTCFeeRateParams = {}) => {
	const { config } = useMidlContext();
	const { network } = useConfig();
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
