import {
	type Config,
	type GetRunesParams,
	getRunes,
	type RunesResponse,
} from "@midl/core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useAccounts } from "~/hooks/useAccounts";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type QueryOptions = Omit<
	UseQueryOptions<RunesResponse>,
	"queryFn" | "queryKey"
> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseRunesParams = Omit<GetRunesParams, "address"> & {
	/**
	 * Optional address to fetch the runes for.
	 * If not provided, it will use the address from the ordinals account.
	 */
	address?: GetRunesParams["address"];
	/**
	 * Optional query options for the runes operation.
	 */
	query?: QueryOptions;
	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
};

/**
 * Gets the runes for an address, with optional limit and offset
 * Limit defaults to 20, offset defaults to 0
 *`
 * @example
 * ```typescript
 * const { runes, isLoading } = useRunes({ address: 'address-123', limit: 10, offset: 0 });
 * ```
 *
 * @param params Parameters for fetching the Runes.
 *
 * @returns
 * - `runes`: `Array<Rune> | undefined` – The list of fetched Runes.
 */
export const useRunes = ({
	address,
	limit,
	offset,
	query: { queryKey, ...query } = {} as QueryOptions,
	config: customConfig,
}: UseRunesParams) => {
	const config = useConfigInternal(customConfig);
	const { ordinalsAccount } = useAccounts({ config });
	const addressToUse = address ?? ordinalsAccount?.address;

	const { data: runes, ...rest } = useQuery<RunesResponse>({
		queryKey: ["runes", address, limit, offset, ...(queryKey ?? [])],
		queryFn: () => {
			if (!addressToUse) {
				throw new Error("Address is required to fetch runes");
			}

			return getRunes(config, {
				address: addressToUse,
				limit,
				offset,
			});
		},
		...query,
	});

	return {
		runes,
		...rest,
	};
};
