import {
  getRunes,
  type GetRunesParams,
  type GetRunesResponse,
} from "@midl-xyz/midl-js-core";
import { type QueryOptions, useQuery } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type UseRunesParams = GetRunesParams & {
  query?: QueryOptions<GetRunesResponse>;
};

export const useRunes = ({
  address,
  limit,
  offset,
  query: { queryKey, ...query } = {},
}: UseRunesParams) => {
  const { config } = useMidlContext();

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
