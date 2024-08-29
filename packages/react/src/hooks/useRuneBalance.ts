import {
  getRuneBalance,
  type GetRuneBalanceParams,
  type GetRuneBalanceResponse,
} from "@midl-xyz/midl-js-core";
import { type QueryOptions, useQuery } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type UseRuneBalanceParams = GetRuneBalanceParams & {
  query?: QueryOptions<GetRuneBalanceResponse>;
};

export const useRuneBalance = ({
  address,
  runeId,
  query: { queryKey, ...query } = {},
}: UseRuneBalanceParams) => {
  const { config } = useMidlContext();

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
