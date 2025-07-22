import {
	type Config,
	type SignMessageParams,
	SignMessageProtocol,
	type SignMessageResponse,
	getDefaultAccount,
	signMessage,
} from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
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

				const account = getDefaultAccount(config);

				signingAddress = account.address;
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
