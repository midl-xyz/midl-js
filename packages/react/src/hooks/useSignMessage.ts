import {
	type SignMessageParams,
	SignMessageProtocol,
	type SignMessageResponse,
	signMessage,
} from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useAccounts } from "~/hooks/useAccounts";
import { useConfig } from "~/hooks/useConfig";

type SignMessageVariables = Omit<SignMessageParams, "address"> & {
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
	const config = useConfig();
	const { paymentAccount } = useAccounts();

	const { mutate, mutateAsync, ...rest } = useMutation<
		SignMessageData,
		SignMessageError,
		SignMessageVariables
	>({
		mutationFn: async ({
			message,
			address,
			protocol = SignMessageProtocol.Ecdsa,
		}) => {
			let signingAddress = address;

			if (!signingAddress) {
				if (!config.currentConnection) {
					throw new Error("No connection");
				}

				if (!paymentAccount) {
					throw new Error("No payment account");
				}

				signingAddress = paymentAccount.address;
			}

			return signMessage(config, {
				message,
				address: signingAddress as string,
				protocol,
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
