import { getBalance } from "@midl-xyz/midl-js-core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type QueryOptions = Omit<UseQueryOptions<number>, "queryFn" | "queryKey"> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseBalanceParams = {
	address: string;
	query?: QueryOptions;
};

/**
 * Fetches the balance of a given address.
 */
export const useBalance = ({ address, query = {} }: UseBalanceParams) => {
	const { config } = useMidlContext();

	const { data, ...rest } = useQuery({
		queryKey: ["balance", address, ...(query.queryKey ?? [])],
		queryFn: async () => {
			return getBalance(config, address);
		},
		retry: false,
		...query,
	});

	return {
		balance: data ?? 0,
		...rest,
	};
};
