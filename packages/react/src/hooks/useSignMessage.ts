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

/**
 * Signs a message with the given address and message. Supports ECDSA and BIP322 protocols.
 *
 * If `address` is not provided, the default account address will be used.
 * If `protocol` is not provided, BIP322 will be used by default.
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
 * - `...rest`: Additional mutation state (e.g. isLoading, error, etc.).
 */
type SignMessageVariables = Omit<SignMessageParams, "address"> & {
	address?: string;
};
type SignMessageError = Error;
type SignMessageData = SignMessageResponse;

type UseSignMessageParams = {
	/**
	 * Mutation options for the sign message operation.
	 */
	mutation?: UseMutationOptions<
		SignMessageData,
		SignMessageError,
		SignMessageVariables
	>;
	/**
	 * Custom configuration to override the default.
	 */
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
			protocol = SignMessageProtocol.Bip322,
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
