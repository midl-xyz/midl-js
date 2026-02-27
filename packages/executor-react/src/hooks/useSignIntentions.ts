import { type Config, SignMessageProtocol } from "@midl/core";
import { signIntentions, type TransactionIntention } from "@midl/executor";
import {
	type MidlContextStore,
	useConfigInternal,
	useStore,
	useStoreInternal,
} from "@midl/react";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";

type SignIntentionsVariables = {
	txId: string;
	intentions?: TransactionIntention[];
};

type SignIntentionsResponse = `0x07${string}`[];

type UseSignIntentionsParams = {
	/**
	 * Mutation options for the sign intentions operation.
	 */
	mutation?: Omit<
		UseMutationOptions<SignIntentionsResponse, Error, SignIntentionsVariables>,
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
		 * If provided, will be used as starting nonce for the intentions
		 */
		nonce?: number;
		/**
		 * BTC address used to sign the transactions.
		 */
		from?: string;
		/**
		 * Protocol to use for signing the intentions.
		 */
		protocol?: SignMessageProtocol;
	};
};

/**
 * Signs transaction intentions in batch.
 *
 * @returns An object with `signIntentions`, `signIntentionsAsync`, `intentions`, and mutation state from React Query.
 *
 * @example
 * const { signIntentions } = useSignIntentions();
 * signIntentions({ txId });
 */
export const useSignIntentions = ({
	config: customConfig,
	store: customStore,
	mutation,
	options = {
		protocol: SignMessageProtocol.Bip322,
	},
}: UseSignIntentionsParams = {}) => {
	const config = useConfigInternal(customConfig);
	const store = useStoreInternal(customStore);
	const { intentions = [] } = useStore(customStore);
	const publicClient = usePublicClient();

	const { mutate, mutateAsync, ...rest } = useMutation({
		mutationFn: async ({ txId, intentions: overrideIntentions }) => {
			if (!publicClient) {
				throw new Error("No public client set");
			}

			const intentionsToSign = overrideIntentions ?? intentions;

			const signed = await signIntentions(
				config,
				publicClient,
				intentionsToSign,
				{
					txId,
					nonce: options.nonce,
					from: options.from,
					protocol: options.protocol,
				},
			);

			const signedByIntention = new Map(
				intentionsToSign.map((intention, index) => [intention, signed[index]]),
			);

			store.setState((state) => {
				return {
					intentions: state.intentions?.map((intention) =>
						signedByIntention.has(intention)
							? {
									...intention,
									signedEvmTransaction: signedByIntention.get(intention),
								}
							: intention,
					),
				};
			});

			return signed;
		},
		...mutation,
	});

	return {
		signIntentions: mutate,
		signIntentionsAsync: mutateAsync,
		intentions,
		...rest,
	};
};
