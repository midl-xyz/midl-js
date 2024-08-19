import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMidlContext } from "~/context";
import type { ConnectParams } from "@midl-xyz/midl-js-core";
export const useConnect = (params: ConnectParams) => {
  const { config } = useMidlContext();
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    mutationFn: async ({ id }: { id?: string }) => {
      const connector =
        config.connectors.find(connector => connector.id === id) ??
        config.connectors[0];

      return connector.connect(params);
    },
  });
};
