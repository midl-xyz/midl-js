import {
	type Config,
	type RuneResponse,
	getRune,
} from "@midl-xyz/midl-js-core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type QueryOptions = Omit<
	UseQueryOptions<RuneResponse>,
	"queryFn" | "queryKey"
> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseRuneParams = {
	/**
	 * The ID of the rune to fetch.
	 */
	runeId: string;
	/**
	 * Optional query options for the rune operation.
	 */
	query?: QueryOptions;
	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
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
	config: customConfig,
}: UseRuneParams) => {
	const config = useConfigInternal(customConfig);

	const { data, ...rest } = useQuery<RuneResponse>({
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
