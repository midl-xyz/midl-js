import {
  signPSBT,
  type SignPSBTParams,
  type SignPSBTResponse,
} from "@midl-xyz/midl-js-core";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type SignPSBTVariables = SignPSBTParams;

type SignPSBTError = Error;

type SignPSBTData = SignPSBTResponse;

type UseSignPSBTParams = {
  mutation?: Omit<
    UseMutationOptions<SignPSBTData, SignPSBTError, SignPSBTVariables>,
    "mutationFn"
  >;
};

export const useSignPSBT = ({ mutation }: UseSignPSBTParams = {}) => {
  const { config } = useMidlContext();

  const { mutate, mutateAsync, ...rest } = useMutation<
    SignPSBTData,
    SignPSBTError,
    SignPSBTVariables
  >({
    mutationFn: async params => {
      return signPSBT(config, params);
    },
    ...mutation,
  });

  return {
    signPSBT: mutate,
    signPSBTAsync: mutateAsync,
    ...rest,
  };
};
