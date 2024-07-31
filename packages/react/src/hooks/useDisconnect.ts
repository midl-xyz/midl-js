import { useMutation } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

export const useDisconnect = () => {
  const { config } = useMidlContext();

  return useMutation({
    mutationFn: async () => {
      return config.currentConnection?.disconnect();
    },
  });
};
