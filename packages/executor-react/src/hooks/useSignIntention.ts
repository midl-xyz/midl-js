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
import { usePublicClient } from "wagmi";
import { useLastNonce } from "~/hooks";

type SignIntentionVariables = {
	txId: string;
	intention: TransactionIntention;
};

type SignIntentionResponse = `0x07${string}`;

type UseSignIntentionParams = {
	/**
	 * Mutation options for the sign intention operation.
	 */
	mutation?: Omit<
		UseMutationOptions<SignIntentionResponse, Error, SignIntentionVariables>,
		"mutationFn"
	>;
	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
	/**
	 * Custom store to override the default.
	 */
	store?: MidlContextStore;
	options?: {
		/**
		 * BTC address used to sign the transactions.
		 */
		from?: string;
		/**
		 * Protocol to use for signing the intention.
		 */
		protocol?: SignMessageProtocol;
	};
};

/**
 * Signs a transaction intention.
 *
 * @returns An object with `signIntention`, `signIntentionAsync`, `intentions`, and mutation state from React Query.
 *
 * @example
 * const { signIntention } = useSignIntention();
 * signIntention({ intention, txId });
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
	const publicClient = usePublicClient();

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
					from: options.from,
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
