import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type UseDisconnectParams = {
  mutation?: Omit<UseMutationOptions, "mutationFn">;
};

export const useDisconnect = ({ mutation }: UseDisconnectParams = {}) => {
  const { config } = useMidlContext();

  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationFn: async () => {
      return config.currentConnection?.disconnect();
    },
    ...mutation,
  });

  return {
    disconnect: mutate,
    disconnectAsync: mutateAsync,
    ...rest,
  };
};
