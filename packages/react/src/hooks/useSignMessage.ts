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

/**
 * Custom hook to sign a message.
 *
 * This hook provides functions to sign a message using the connected payment account or a specified address.
 *
 * @example
 * ```typescript
 * const { signMessage, signMessageAsync } = useSignMessage();
 * 
 * // To sign a message
 * signMessage({ message: 'Hello, World!' });
 * 
 * // To sign a message asynchronously
 * await signMessageAsync({ message: 'Hello, World!' });
 * ```
 *
 * @param {UseSignMessageParams} [params] - Configuration options for the mutation.
 *
 * @returns
 * - `signMessage`: `(variables: SignMessageVariables) => void` – Function to initiate message signing.
 * - `signMessageAsync`: `(variables: SignMessageVariables) => Promise<SignMessageData>` – Function to asynchronously sign the message.
 * - `isLoading`: `boolean` – Indicates if the mutation is currently loading.
 * - `error`: `Error | null` – Contains error information if the mutation failed.
 * - `data`: `SignMessageData | undefined` – The response data from the message signing.
 */
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
