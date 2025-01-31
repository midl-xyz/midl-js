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
 * Gets a rune by its ID
 *
 * @example
 * ```typescript
 * const { rune, isLoading } = useRune({ runeId: 'rune-123' });
 * ```
 *
 * @param params Parameters for fetching the Rune.
 *
 * @returns
 * - **rune**: `Rune | undefined` – The fetched Rune data.
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
