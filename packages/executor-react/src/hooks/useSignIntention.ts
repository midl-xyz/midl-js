import { type Config, SignMessageProtocol } from "@midl-xyz/midl-js-core";
import {
	type TransactionIntention,
	signIntention,
} from "@midl-xyz/midl-js-executor";
import {
	type MidlContextStore,
	useConfigInternal,
	useStore,
	useStoreInternal,
} from "@midl-xyz/midl-js-react";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";
import { useLastNonce } from "~/hooks";

type SignIntentionVariables = {
	txId: string;
	intention: TransactionIntention;
};

type SignIntentionResponse = `0x07${string}`;

type UseSignIntentionParams = {
	mutation?: Omit<
		UseMutationOptions<SignIntentionResponse, Error, SignIntentionVariables>,
		"mutationFn"
	>;
	config?: Config;
	store?: MidlContextStore;
	options?: {
		publicKey?: string;
		protocol?: SignMessageProtocol;
	};
};

/**
 * Signs a transaction intention.
 *
 * @returns
 * - **signIntention**: `(intention: TransactionIntention) => void` – Function to sign a specific transaction intention.
 * - **signIntentionAsync**: `(intention: TransactionIntention) => Promise<SignTransactionResult>` – Function to asynchronously sign an intention.
 * - **intentions**: `TransactionIntention[]` – The current list of transaction intentions.
 * - **data**: `SignIntentionResponse` – The signed intention response.
 * - **..rest**: `UseMutationState` – The state of the sign intention mutation.
 * - Other mutation states from `useMutation`.
 */
export const useSignIntention = ({
	config: customConfig,
	store: customStore,
	mutation,
	options = {
		protocol: SignMessageProtocol.Bip322,
	},
}: UseSignIntentionParams = {}) => {
	const nonce = useLastNonce();
	const config = useConfigInternal(customConfig);
	const store = useStoreInternal(customStore);
	const { intentions = [] } = useStore(customStore);
	const { data: publicClient } = useWalletClient();

	const { mutate, mutateAsync, ...rest } = useMutation({
		mutationFn: async ({
			intention,
			txId,
		}: {
			intention: TransactionIntention;
			txId: string;
		}) => {
			if (!publicClient) {
				throw new Error("No public client set");
			}

			const signed = await signIntention(
				config,
				publicClient,
				intention,
				intentions,
				{
					txId,
					nonce,
					publicKey: options.publicKey,
					protocol: options.protocol,
				},
			);

			store.setState((state) => {
				return {
					intentions: state.intentions?.map((it) =>
						it === intention
							? {
									...it,
									signedEvmTransaction: signed,
								}
							: it,
					),
				};
			});

			return signed;
		},
		...mutation,
	});

	return {
		signIntention: mutate,
		signIntentionAsync: mutateAsync,
		intentions,
		...rest,
	};
};
