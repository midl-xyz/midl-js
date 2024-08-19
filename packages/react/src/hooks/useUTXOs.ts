import { getUTXOs } from "@midl-xyz/midl-js-core";
import { useQuery } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

export const useUTXOs = (address?: string) => {
  const { config } = useMidlContext();

  const skipQuery = !config.network || !config.currentConnection || !address;

  return useQuery({
    queryKey: ["utxos", address],
    queryFn: async () => {
      // biome-ignore lint/style/noNonNullAssertion: skip query if no address
      return getUTXOs(config, address!);
    },
    enabled: !skipQuery,
  });
};
