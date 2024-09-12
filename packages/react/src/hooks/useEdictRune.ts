import {
  edictRune,
  type EdictRuneResponse,
  type EdictRuneParams,
} from "@midl-xyz/midl-js-core";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type EdictRuneVariables = EdictRuneParams;

type EdictRuneError = Error;

type EdictRuneData = EdictRuneResponse;

type UseEdictRuneParams = {
  mutation?: Omit<
    UseMutationOptions<EdictRuneData, EdictRuneError, EdictRuneVariables>,
    "mutationFn"
  >;
};

export const useEdictRune = ({ mutation }: UseEdictRuneParams = {}) => {
  const { config } = useMidlContext();

  const { mutationKey = [], ...mutationParams } = mutation ?? {};

  const { mutate, mutateAsync, ...rest } = useMutation<
    EdictRuneData,
    EdictRuneError,
    EdictRuneVariables
  >({
    mutationKey: ["edictRune", ...mutationKey],
    mutationFn: async params => {
      return edictRune(config, params);
    },
    ...mutationParams,
  });

  return {
    edictRune: mutate,
    edictRuneAsync: mutateAsync,
    ...rest,
  };
};
