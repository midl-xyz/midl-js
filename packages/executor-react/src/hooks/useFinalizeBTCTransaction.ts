import type {
	Config,
	EdictRuneResponse,
	TransferBTCResponse,
} from "@midl-xyz/midl-js-core";
import { finalizeBTCTransaction } from "@midl-xyz/midl-js-executor";
import {
	type MidlContextStore,
	useConfigInternal,
	useStoreInternal,
} from "@midl-xyz/midl-js-react";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { Address, StateOverride } from "viem";
import { useWalletClient } from "wagmi";

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

type UseFinalizeBTCTransactionResponse =
	| EdictRuneResponse
	| TransferBTCResponse;

type UseFinalizeBTCTransactionParams = {
	mutation?: Omit<
		UseMutationOptions<
			UseFinalizeBTCTransactionResponse,
			Error,
			FinalizeMutationVariables
		>,
		"mutationFn"
	>;
	config?: Config;
	store?: MidlContextStore;
};

/**
 * Prepares BTC transaction for the intentions. Finalizes the transaction.
 * Calculates gas limits for EVM transactions, total fees and transfers.
 *
 * @returns
 * - **finalizeBTCTransaction**: `() => void` – Function to initiate finalizing BTC transactions.
 * - **finalizeBTCTransactionAsync**: `() => Promise<EdictRuneResponse>` – Function to asynchronously finalize BTC transactions.
 * - **data**: `EdictRuneResponse` – The finalized BTC transaction.
 * - Other mutation states from `useMutation`.
 */
export const useFinalizeBTCTransaction = ({
	mutation,
	config: customConfig,
	store: customStore,
}: UseFinalizeBTCTransactionParams = {}) => {
	const store = useStoreInternal(customStore);
	const config = useConfigInternal(customConfig);
	const { data: publicClient } = useWalletClient();

	const { mutate, mutateAsync, ...rest } = useMutation<
		UseFinalizeBTCTransactionResponse,
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

	return {
		finalizeBTCTransaction: mutate,
		finalizeBTCTransactionAsync: mutateAsync,
		...rest,
	};
};
