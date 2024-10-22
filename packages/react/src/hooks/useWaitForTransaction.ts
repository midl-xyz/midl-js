import { waitForTransaction } from "@midl-xyz/midl-js-core";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type WaitForTransactionVariables = {
  txId: string;
  confirmations?: number;
  maxAttempts?: number;
  intervalMs?: number;
};

type WaitForTransactionData = number;
type WaitForTransactionError = Error;

type UseWaitForTransactionParams = {
  mutation?: Omit<
    UseMutationOptions<
      WaitForTransactionData,
      WaitForTransactionError,
      WaitForTransactionVariables
    >,
    "mutationFn"
  >;
};

export const useWaitForTransaction = ({
  mutation,
}: UseWaitForTransactionParams = {}) => {
  const { config } = useMidlContext();

  const data = useMutation<
    WaitForTransactionData,
    WaitForTransactionError,
    WaitForTransactionVariables
  >({
    mutationFn: async ({
      txId,
      confirmations = 1,
      maxAttempts,
      intervalMs,
    }) => {
      return waitForTransaction(config, txId, confirmations, {
        maxAttempts,
        intervalMs,
      });
    },
    ...mutation,
  });

  return {
    waitForTransaction: data.mutate,
    waitForTransactionAsync: data.mutateAsync,
    ...mutation,
  };
};
