import { getRune, type GetRuneResponse } from "@midl-xyz/midl-js-core";
import { type QueryOptions, useQuery } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type UseRuneParams = {
  runeId: string;
  query?: Omit<QueryOptions<GetRuneResponse>, "queryFn">;
};

export const useRune = ({
  runeId,
  query: { queryKey, ...query } = {},
}: UseRuneParams) => {
  const { config } = useMidlContext();

  const { data, ...rest } = useQuery<GetRuneResponse>({
    queryKey: ["rune", runeId, ...(queryKey ?? [])],
    queryFn: () => {
      return getRune(config, runeId);
    },
    ...query,
  });

  return {
    rune: data,
    ...rest,
  };
};
