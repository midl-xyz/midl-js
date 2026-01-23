import {
	type Config,
	type SignMessageParams,
	SignMessageProtocol,
	type SignMessageResponse,
	getDefaultAccount,
	signMessages,
} from "@midl/core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type SignMessagesVariables = Array<
	Omit<SignMessageParams, "address"> & {
		address?: string;
	}
>;
type SignMessagesError = Error;
type SignMessagesData = SignMessageResponse[];

type UseSignMessagesParams = {
	/**
	 * Mutation options for the sign messages operation.
	 */
	mutation?: UseMutationOptions<
		SignMessagesData,
		SignMessagesError,
		SignMessagesVariables
	>;
	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
};

/**
 * Signs multiple messages in a single request. Supports ECDSA and BIP322 protocols.
 *
 * If `address` is not provided for a message, the default account address will be used.
 * If `protocol` is not provided, BIP322 will be used by default.
 *
 * @example
 * ```typescript
 * const { signMessages, signMessagesAsync } = useSignMessages();
 *
 * signMessages([
 *   { message: "Hello, World!" },
 *   { message: "Second message" },
 * ]);
 * ```
 *
 * @param params Configuration options for the mutation.
 *
 * @returns
 * - `signMessages`: `(variables: SignMessagesVariables) => void` – Function to initiate message signing.
 * - `signMessagesAsync`: `(variables: SignMessagesVariables) => Promise<SignMessagesData>` – Function to asynchronously sign the messages.
 * - `...rest`: Additional mutation state (e.g. isLoading, error, etc.).
 */
export const useSignMessages = ({
	mutation,
	config: customConfig,
}: UseSignMessagesParams = {}) => {
	const config = useConfigInternal(customConfig);

	const { mutate, mutateAsync, ...rest } = useMutation<
		SignMessagesData,
		SignMessagesError,
		SignMessagesVariables
	>({
		mutationFn: async (messages) => {
			let defaultAddress: string | undefined;

			if (messages.some((message) => !message.address)) {
				const account = getDefaultAccount(config);
				defaultAddress = account.address;
			}

			const normalizedMessages = messages.map((message) => ({
				address: message.address ?? (defaultAddress as string),
				message: message.message,
				protocol: message.protocol ?? SignMessageProtocol.Bip322,
			}));

			return signMessages(config, normalizedMessages);
		},
		...mutation,
	});

	return {
		signMessages: mutate,
		signMessagesAsync: mutateAsync,
		...rest,
	};
};
