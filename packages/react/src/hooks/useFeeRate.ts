import { getFeeRate, type GetFeeRateResponse } from "@midl-xyz/midl-js-core";
import { type QueryOptions, useQuery } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type UseFeeRateParams = {
  query?: QueryOptions<GetFeeRateResponse>;
};

export const useFeeRate = ({ query }: UseFeeRateParams = {}) => {
  const { config } = useMidlContext();
  return useQuery({
    queryKey: ["feeRate"],
    queryFn: async () => {
      return getFeeRate(config);
    },
    ...query,
  });
};
