import type {
	Config,
	EdictRuneResponse,
	SignMessageProtocol,
	TransferBTCResponse,
} from "@midl-xyz/midl-js-core";
import {
	type TransactionIntention,
	finalizeBTCTransaction,
	signIntention,
} from "@midl-xyz/midl-js-executor";
import {
	type MidlContextStore,
	useConfigInternal,
	useStore,
	useStoreInternal,
} from "@midl-xyz/midl-js-react";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { Address, StateOverride } from "viem";
import { useGasPrice, useWalletClient } from "wagmi";
import { useLastNonce } from "~/hooks/useLastNonce";

type FinalizeMutationVariables = {
	/**
	 * State override to estimate the cost of the transaction
	 */
	stateOverride?: StateOverride;
	/**
	 * If true, send complete transaction
	 */
	shouldComplete?: boolean;

	assetsToWithdraw?: [Address] | [Address, Address];

	feeRateMultiplier?: number;

	/**
	 * If true, skip the gas estimation for EVM transactions
	 */
	skipEstimateGasMulti?: boolean;
};

type UseFinalizeTxIntentionsResponse = EdictRuneResponse | TransferBTCResponse;

type UseFinalizeTxIntentionsParams = {
	mutation?: Omit<
		UseMutationOptions<
			UseFinalizeTxIntentionsResponse,
			Error,
			FinalizeMutationVariables
		>,
		"mutationFn"
	>;

	options?: {
		signMessageProtocol?: SignMessageProtocol;
	};
	config?: Config;
	store?: MidlContextStore;
};

/**
 * Prepares BTC transaction for the intentions. Finalizes the transaction and signs the intentions.
 * Calculates gas limits for EVM transactions, total fees and transfers.
 *
 * @returns
 * - **finalizeBTCTransaction**: `() => void` – Function to initiate finalizing BTC transactions.
 * - **finalizeBTCTransactionAsync**: `() => Promise<EdictRuneResponse>` – Function to asynchronously finalize BTC transactions.
 * - **btcTransaction**: `EdictRuneResponse` – The finalized BTC transaction.
 * - **signIntention**: `(intention: TransactionIntention) => void` – Function to sign a specific transaction intention.
 * - **signIntentionAsync**: `(intention: TransactionIntention) => Promise<SignTransactionResult>` – Function to asynchronously sign an intention.
 * - **intentions**: `TransactionIntention[]` – The current list of transaction intentions.
 * - **signIntentionState**: `UseMutationState` – The state of the sign intention mutation.
 * - Other mutation states from `useMutation`.
 */
export const useFinalizeTxIntentions = ({
	mutation,
	options = {},
	config: customConfig,
	store: customStore,
}: UseFinalizeTxIntentionsParams = {}) => {
	const store = useStoreInternal(customStore);
	const config = useConfigInternal(customConfig);
	const { intentions = [] } = useStore(customStore);
	const { data: publicClient } = useWalletClient();
	const nonce = useLastNonce();
	const { data: gasPrice } = useGasPrice();

	const { mutate, mutateAsync, data, ...rest } = useMutation<
		UseFinalizeTxIntentionsResponse,
		Error,
		FinalizeMutationVariables
	>({
		mutationFn: async ({
			stateOverride,
			shouldComplete,
			assetsToWithdraw,
			feeRateMultiplier,
			skipEstimateGasMulti,
		} = {}) => {
			if (!publicClient) {
				throw new Error("No public client set");
			}

			return finalizeBTCTransaction(config, store, publicClient, {
				stateOverride,
				shouldComplete,
				assetsToWithdraw,
				feeRateMultiplier,
				skipEstimateGasMulti,
			});
		},
		...mutation,
	});

	const {
		mutate: _signIntention,
		mutateAsync: signIntentionAsync,
		...restSignIntention
	} = useMutation({
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
				protocol: options.signMessageProtocol,
			});
		},
	});

	return {
		finalizeBTCTransaction: mutate,
		finalizeBTCTransactionAsync: mutateAsync,
		signIntention: _signIntention,
		signIntentionAsync,
		intentions,
		signIntentionState: restSignIntention,
		btcTransaction: data,
		...rest,
	};
};
