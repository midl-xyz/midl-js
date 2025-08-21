import { type Config, getBalance, getDefaultAccount } from "@midl/core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type QueryOptions = Omit<UseQueryOptions<number>, "queryFn" | "queryKey"> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseBalanceParams = {
	/**
	 * The address to fetch the balance for. If not provided, uses the default account.
	 */
	address?: string;
	/**
	 * Query options for react-query.
	 */
	query?: QueryOptions;
	/**
	 * Config object to use instead of the one from context.
	 */
	config?: Config;
};

/**
 * Fetches the balance of a given address or the default account if no address is provided.
 *
 * @example
 * ```typescript
 * const { balance } = useBalance({ address: 'bc1q...' });
 * ```
 *
 * @param params - Parameters for fetching the balance.
 *
 * @returns
 * - **balance**: `number` – The balance of the address (or 0 if not found).
 * - ...rest: Additional query state from useQuery.
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
