import {
	type Config,
	type GetRuneBalanceParams,
	type RuneBalanceResponse,
	getRuneBalance,
} from "@midl-xyz/midl-js-core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useAccounts } from "~/hooks/useAccounts";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type QueryOptions = Omit<
	UseQueryOptions<RuneBalanceResponse>,
	"queryFn" | "queryKey"
> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseRuneBalanceParams = Omit<GetRuneBalanceParams, "address"> & {
	/**
	 * Optional query options for the rune balance operation.
	 */
	query?: QueryOptions;
	/**
	 * Optional custom configuration to override the default.
	 */
	config?: Config;
	/**
	 * Optional address to fetch the rune balance for.
	 * If not provided, it will use the address from the ordinals account.
	 */
	address?: GetRuneBalanceParams["address"];
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
	config: customConfig,
}: UseRuneBalanceParams) => {
	const config = useConfigInternal(customConfig);
	const { ordinalsAccount } = useAccounts({ config });
	const addressToUse = address ?? ordinalsAccount?.address;

	const { data: balance, ...rest } = useQuery<RuneBalanceResponse>({
		queryKey: ["runeBalance", addressToUse, runeId, ...(queryKey ?? [])],
		queryFn: () => {
			if (!addressToUse) {
				throw new Error("Address is required to fetch Rune balance.");
			}

			return getRuneBalance(config, {
				address: addressToUse,
				runeId,
			});
		},
		...query,
	});

	return {
		balance,
		...rest,
	};
};
