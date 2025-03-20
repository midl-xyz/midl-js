import {
	type GetRuneBalanceParams,
	type GetRuneBalanceResponse,
	getRuneBalance,
} from "@midl-xyz/midl-js-core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type QueryOptions = Omit<
	UseQueryOptions<GetRuneBalanceResponse>,
	"queryFn" | "queryKey"
> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseRuneBalanceParams = GetRuneBalanceParams & {
	query?: QueryOptions;
};

/**
 * Fetches the balance of a specified Rune for a given address.
 *
 * @example
 * ```typescript
 * const { balance, isLoading } = useRuneBalance({ address: 'address-123', runeId: 'rune-123' });
 * ```
 *
 * @param params Parameters for fetching the Rune balance.
 *
 * @returns
 * - **balance**: `RuneBalance | undefined` – The balance of the specified Rune.
 * - **isLoading**: `boolean` – Indicates if the query is currently loading.
 * - **error**: `Error | null` – Contains error information if the query failed.
 * - **isFetching**: `boolean` – Indicates if the query is in the background fetching state.
 */
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
