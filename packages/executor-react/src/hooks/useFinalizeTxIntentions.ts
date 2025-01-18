import type {
	EdictRuneResponse,
	TransferBTCResponse,
} from "@midl-xyz/midl-js-core";
import { useMidlContext } from "@midl-xyz/midl-js-react";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { Address, StateOverride } from "viem";
import { useGasPrice, useWalletClient } from "wagmi";
import { useStore } from "zustand";
import {
	finalizeBTCTransaction,
	signIntention,
} from "@midl-xyz/midl-js-executor";
import { useLastNonce } from "~/hooks/useLastNonce";
import type { TransactionIntention } from "~/types/intention";

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
};

/**
 * Custom hook to finalize transaction intentions for BTC transactions.
 *
 * This hook processes all pending transaction intentions by calculating their total cost,
 * preparing the necessary BTC transfers, and executing the `edictRune` action.
 * It also allows signing individual transaction intentions.
 *
 * @example
 * ```typescript
 * const { finalizeBTCTransaction, signIntention, isLoading } = useFinalizeTxIntentions({ stateOverride });
 *
 * // To finalize all BTC transactions
 * finalizeBTCTransaction();
 *
 * // To sign a specific transaction intention
 * signIntention(transactionIntention);
 * ```
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
}: UseFinalizeTxIntentionsParams = {}) => {
	const { store, config } = useMidlContext();
	const { intentions = [] } = useStore(store);
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
		} = {}) => {
			if (!publicClient) {
				throw new Error("No public client set");
			}

			return finalizeBTCTransaction(config, store, publicClient, {
				stateOverride,
				shouldComplete,
				assetsToWithdraw,
				feeRateMultiplier,
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
