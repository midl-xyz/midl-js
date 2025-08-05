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
	// biome-ignore lint/suspicious/noConfusingVoidType: This is used to allow the function to be called without parameters.
} | void;

type UseFinalizeBTCTransactionResponse =
	| EdictRuneResponse
	| TransferBTCResponse;

type UseFinalizeBTCTransactionParams = {
	/**
	 * Mutation options for React Query.
	 */
	mutation?: Omit<
		UseMutationOptions<
			UseFinalizeBTCTransactionResponse,
			Error,
			FinalizeMutationVariables
		>,
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
};

/**
 * Prepares a Bitcoin transaction for the provided intentions.
 *
 * Calculates gas limits for EVM transactions, total fees, and transfers. Handles both BTC and rune transfers.
 *
 * @returns An object with `finalizeBTCTransaction`, `finalizeBTCTransactionAsync`, and mutation state from React Query.
 *
 * @example
 * const { finalizeBTCTransaction } = useFinalizeBTCTransaction();
 * finalizeBTCTransaction({ feeRate: 10 });
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
