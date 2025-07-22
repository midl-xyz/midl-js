import {
	type Config,
	getBalance,
	getDefaultAccount,
} from "@midl-xyz/midl-js-core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type QueryOptions = Omit<UseQueryOptions<number>, "queryFn" | "queryKey"> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseBalanceParams = {
	address?: string;
	query?: QueryOptions;
	config?: Config;
};

/**
 * Fetches the balance of a given address.
 */
export const useBalance = ({
	address,
	query = {},
	config: customConfig,
}: UseBalanceParams) => {
	const config = useConfigInternal(customConfig);

	const { data, ...rest } = useQuery({
		queryKey: ["balance", address, ...(query.queryKey ?? [])],
		queryFn: async () => {
			const account = getDefaultAccount(config);

			return getBalance(config, address ?? account.address);
		},
		retry: false,
		...query,
	});

	return {
		balance: data ?? 0,
		...rest,
	};
};
