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

/**
 * Custom hook to retrieve the balance of a specific Rune for a given address.
 *
 * This hook fetches the Rune balance associated with the provided `address` and `runeId`.
 *
 * @example
 * ```typescript
 * const { balance, isLoading } = useRuneBalance({ address: 'address-123', runeId: 'rune-123' });
 * ```
 *
 * @param {UseRuneBalanceParams} params - Parameters for fetching the Rune balance.
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
