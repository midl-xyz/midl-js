import { getBalance } from "@midl-xyz/midl-js-core";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

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
	const config = useConfig();

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
