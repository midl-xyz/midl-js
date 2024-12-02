import { type GetRuneResponse, getRune } from "@midl-xyz/midl-js-core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

type QueryOptions = Omit<
	UseQueryOptions<GetRuneResponse>,
	"queryFn" | "queryKey"
> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseRuneParams = {
	runeId: string;
	query?: QueryOptions;
};

/**
 * Custom hook to retrieve a specific Rune by its ID.
 *
 * This hook fetches the Rune data for the given `runeId` from the configured network.
 *
 * @example
 * ```typescript
 * const { rune, isLoading } = useRune({ runeId: 'rune-123' });
 * ```
 *
 * @param {UseRuneParams} params - Parameters for fetching the Rune.
 *
 * @returns
 * - **rune**: `Rune | undefined` – The fetched Rune data.
 * - **isLoading**: `boolean` – Indicates if the query is currently loading.
 * - **error**: `Error | null` – Contains error information if the query failed.
 * - **isFetching**: `boolean` – Indicates if the query is in the background fetching state.
 */
export const useRune = ({
	runeId,
	query: { queryKey, ...query } = {} as QueryOptions,
}: UseRuneParams) => {
	const config = useConfig();

	const { data, ...rest } = useQuery<GetRuneResponse>({
		queryKey: ["rune", runeId, ...(queryKey ?? [])],
		queryFn: () => {
			return getRune(config, runeId);
		},
		retry: false,
		...query,
	});

	return {
		rune: data,
		...rest,
	};
};
