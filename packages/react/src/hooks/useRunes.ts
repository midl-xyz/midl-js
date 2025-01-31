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
