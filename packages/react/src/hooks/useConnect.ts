import { useMutation } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

export const useConnect = () => {
  const { config } = useMidlContext();

  return useMutation({
    mutationFn: async ({ id }: { id?: string }) => {
      const connector =
        config.connectors.find(connector => connector.id === id) ??
        config.connectors[0];

      return connector.connect();
    },
  });
};
