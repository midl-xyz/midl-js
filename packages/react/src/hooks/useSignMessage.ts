import {
	type Config,
	type SignMessageParams,
	SignMessageProtocol,
	type SignMessageResponse,
	signMessage,
} from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useAccounts } from "~/hooks/useAccounts";
import { useConfig } from "~/hooks/useConfig";
import { useConfigInternal } from "~/hooks/useConfigInternal";

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
	config?: Config;
};

/**
 * Signs a message
 *
 * @example
 * ```typescript
 * const { signMessage, signMessageAsync } = useSignMessage();
 *
 * signMessage({ message: 'Hello, World!' });
 * ```
 *
 * @param params Configuration options for the mutation.
 *
 * @returns
 * - `signMessage`: `(variables: SignMessageVariables) => void` – Function to initiate message signing.
 * - `signMessageAsync`: `(variables: SignMessageVariables) => Promise<SignMessageData>` – Function to asynchronously sign the message.
 */
export const useSignMessage = ({
	mutation,
	config: customConfig,
}: UseSignMessageParams = {}) => {
	const { connection } = useConfig(customConfig);
	const config = useConfigInternal(customConfig);

	const { paymentAccount, ordinalsAccount } = useAccounts();

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
				if (!connection) {
					throw new Error("No connection");
				}

				if (!paymentAccount || !ordinalsAccount) {
					throw new Error("No accounts");
				}

				signingAddress = paymentAccount.address ?? ordinalsAccount?.address;
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
