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
import { useGasPrice, useWalletClient } from "wagmi";
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
	signMessageProtocol?: SignMessageProtocol;
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
	signMessageProtocol = SignMessageProtocol.Bip322,
}: UseSignIntentionParams = {}) => {
	const nonce = useLastNonce();
	const { data: gasPrice } = useGasPrice();
	const store = useStoreInternal(customStore);
	const config = useConfigInternal(customConfig);
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

			return signIntention(config, store, publicClient, intention, {
				txId,
				gasPrice,
				nonce,
				protocol: signMessageProtocol,
			});
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
