import {
  AddressPurpose,
  signMessage,
  SignMessageProtocol,
  type SignMessageResponse,
} from "@midl-xyz/midl-js-core";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type SignMessageVariables = {
  message: string;
  address?: string;
};
type SignMessageError = Error;
type SignMessageData = SignMessageResponse;

type UseSignMessageParams = {
  mutation?: Omit<
    UseMutationOptions<SignMessageData, SignMessageError, SignMessageVariables>,
    "mutationFn"
  >;
};

export const useSignMessage = ({ mutation }: UseSignMessageParams = {}) => {
  const { config } = useMidlContext();

  const { mutate, mutateAsync, ...rest } = useMutation<
    SignMessageData,
    SignMessageError,
    SignMessageVariables
  >({
    mutationFn: async ({ message, address }) => {
      let signingAddress = address;

      if (!address) {
        if (!config.currentConnection) {
          throw new Error("No connection");
        }

        const accounts = await config.currentConnection.getAccounts();

        const paymentAccount = accounts.find(
          it => it.purpose === AddressPurpose.Payment
        );

        if (!paymentAccount) {
          throw new Error("No payment account");
        }

        signingAddress = paymentAccount.address;
      }

      return signMessage(config, {
        message,
        address: signingAddress as string,
        protocol: SignMessageProtocol.Ecdsa,
      });
    },
    ...mutation,
  });

  return {
    signMessage: mutate,
    signMessageAsync: mutateAsync,
    ...rest,
  };
};
