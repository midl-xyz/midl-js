import { etchRune, type EtchRuneParams } from "@midl-xyz/midl-js-core";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type EtchRuneData = Awaited<ReturnType<typeof etchRune>>;
type EtchRuneError = Error;
type EtchRuneVariables = EtchRuneParams;

type UseEtchRuneParams = {
  mutation?: Omit<
    UseMutationOptions<EtchRuneData, EtchRuneError, EtchRuneVariables>,
    "mutationFn"
  >;
};

export const useEtchRune = (params: UseEtchRuneParams) => {
  const { config } = useMidlContext();

  const mutation = useMutation<EtchRuneData, EtchRuneError, EtchRuneVariables>({
    mutationFn: params => {
      return etchRune(config, params);
    },
    ...params.mutation,
  });

  return {
    etchRune: mutation.mutate,
    etchRuneAsync: mutation.mutateAsync,
    ...mutation,
  };
};
