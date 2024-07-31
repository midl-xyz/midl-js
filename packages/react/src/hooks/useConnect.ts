import { useMutation } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

export const useConnect = () => {
  const { config } = useMidlContext();

  return useMutation({
    mutationFn: async () => {
      const [snapConnector] = config.connectors;

      return snapConnector.connect();
    },
  });
};
