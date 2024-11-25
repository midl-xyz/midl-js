import {
	type GetRuneBalanceParams,
	type GetRuneBalanceResponse,
	getRuneBalance,
} from "@midl-xyz/midl-js-core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type QueryOptions = Omit<UseQueryOptions<GetRuneBalanceResponse>, "queryFn">;

type UseRuneBalanceParams = GetRuneBalanceParams & {
	query?: QueryOptions;
};

export const useRuneBalance = ({
	address,
	runeId,
	query: { queryKey, ...query } = {} as QueryOptions,
}: UseRuneBalanceParams) => {
	const { config } = useMidlContext();

	const { data: balance, ...rest } = useQuery<GetRuneBalanceResponse>({
		queryKey: ["runeBalance", address, runeId, ...(queryKey ?? [])],
		queryFn: () => {
			return getRuneBalance(config, { address, runeId });
		},
		...query,
	});

	return {
		balance,
		...rest,
	};
};
