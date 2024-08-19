import {
  AddressPurpose,
  signMessage,
  SignMessageProtocol,
  type SignMessageResponse,
} from "@midl-xyz/midl-js-core";
import { useMutation } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

export const useSignMessage = () => {
  const { config } = useMidlContext();

  return useMutation<
    SignMessageResponse,
    Error,
    {
      message: string;
      address?: string;
    }
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
  });
};
