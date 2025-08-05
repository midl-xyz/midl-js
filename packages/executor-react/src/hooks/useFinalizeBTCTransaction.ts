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
import type { StateOverride } from "viem";
import { usePublicClient } from "wagmi";

type FinalizeMutationVariables = {
	/**
	 * State override to estimate the cost of the transaction
	 */
	stateOverride?: StateOverride;

	/**
	 * Number of assets to withdraw. This is used to calculate the total fees.
	 */
	assetsToWithdrawSize?: number;

	/**
	 * Custom fee rate in sats/vB
	 */
	feeRate?: number;

	/**
	 * If true, skip the gas estimation for EVM transactions
	 */
	skipEstimateGasMulti?: boolean;
	/**
	 * BTC address used to sign the transactions
	 */
	from?: string;
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
 * - **data**: `EdictRuneResponse | TransferBTCResponse` – The finalized BTC transaction.
 * - Other mutation states from `useMutation`.
 */
export const useFinalizeBTCTransaction = ({
	mutation,
	config: customConfig,
	store: customStore,
}: UseFinalizeBTCTransactionParams = {}) => {
	const store = useStoreInternal(customStore);
	const config = useConfigInternal(customConfig);
	const publicClient = usePublicClient();

	const { mutate, mutateAsync, ...rest } = useMutation<
		UseFinalizeBTCTransactionResponse,
		Error,
		FinalizeMutationVariables
	>({
		mutationFn: async ({
			stateOverride,
			assetsToWithdrawSize,
			feeRate,
			skipEstimateGasMulti,
			from,
		} = {}) => {
			if (!publicClient) {
				throw new Error("No public client set");
			}

			return finalizeBTCTransaction(
				config,
				store.getState().intentions ?? [],
				publicClient,
				{
					stateOverride,
					assetsToWithdrawSize,
					feeRate,
					skipEstimateGasMulti,
					from,
				},
			);
		},
		...mutation,
	});

	return {
		finalizeBTCTransaction: mutate,
		finalizeBTCTransactionAsync: mutateAsync,
		...rest,
	};
};
