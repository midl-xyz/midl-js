import {
	type GetRunesParams,
	type GetRunesResponse,
	getRunes,
} from "@midl-xyz/midl-js-core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

type QueryOptions = Omit<
	UseQueryOptions<GetRunesResponse>,
	"queryFn" | "queryKey"
> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseRunesParams = GetRunesParams & {
	query?: QueryOptions;
};

/**
 * Custom hook to retrieve a list of Runes for a given address with pagination.
 *
 * This hook fetches Runes associated with the provided `address`, supporting pagination through `limit` and `offset`.
 *
 * @example
 * ```typescript
 * const { runes, isLoading } = useRunes({ address: 'address-123', limit: 10, offset: 0 });
 * ```
 *
 * @param {UseRunesParams} params - Parameters for fetching the Runes.
 *
 * @returns
 * - `runes`: `Array<Rune> | undefined` – The list of fetched Runes.
 * - `isLoading`: `boolean` – Indicates if the query is currently loading.
 * - `error`: `Error | null` – Contains error information if the query failed.
 * - `isFetching`: `boolean` – Indicates if the query is in the background fetching state.
 */
export const useRunes = ({
	address,
	limit,
	offset,
	query: { queryKey, ...query } = {} as QueryOptions,
}: UseRunesParams) => {
	const config = useConfig();

	const { data: runes, ...rest } = useQuery<GetRunesResponse>({
		queryKey: ["runes", address, limit, offset, ...(queryKey ?? [])],
		queryFn: () => {
			return getRunes(config, { address, limit, offset });
		},
		...query,
	});

	return {
		runes,
		...rest,
	};
};
