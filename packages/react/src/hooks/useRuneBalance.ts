import {
	type GetRuneBalanceParams,
	type GetRuneBalanceResponse,
	getRuneBalance,
} from "@midl-xyz/midl-js-core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

type QueryOptions = Omit<
	UseQueryOptions<GetRuneBalanceResponse>,
	"queryFn" | "queryKey"
> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseRuneBalanceParams = GetRuneBalanceParams & {
	query?: QueryOptions;
};

export const useRuneBalance = ({
	address,
	runeId,
	query: { queryKey, ...query } = {} as QueryOptions,
}: UseRuneBalanceParams) => {
	const config = useConfig();

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
