import { broadcastTransaction } from "@midl-xyz/midl-js-core";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type UseBroadcastTransactionVariables = {
  tx: string;
};

type UseBroadcastTransactionError = Error;

type UseBroadcastTransactionData = string;

type UseBroadcastTransactionParams = {
  mutation?: Omit<
    UseMutationOptions<
      UseBroadcastTransactionData,
      UseBroadcastTransactionError,
      UseBroadcastTransactionVariables
    >,
    "mutationFn"
  >;
};

export const useBroadcastTransaction = ({
  mutation,
}: UseBroadcastTransactionParams = {}) => {
  const { config } = useMidlContext();

  const { mutate, mutateAsync, ...rest } = useMutation<
    UseBroadcastTransactionData,
    UseBroadcastTransactionError,
    UseBroadcastTransactionVariables
  >({
    mutationFn: async ({ tx }) => {
      return broadcastTransaction(config, tx);
    },
    ...mutation,
  });

  return {
    broadcastTransaction: mutate,
    broadcastTransactionAsync: mutateAsync,
    ...rest,
  };
};
