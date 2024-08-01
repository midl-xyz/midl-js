import { invoke } from "@midl-xyz/midl-js-core";
import { useQuery } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

export const useSnapQuery = <T>(
  method: string,
  params: Record<string, unknown>
) => {
  const { config } = useMidlContext();

  return useQuery({
    queryKey: ["snap", method, params],
    queryFn: async () => {
      return invoke<T>(config, {
        method,
        params,
      });
    },
  });
};
