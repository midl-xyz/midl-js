import type {
	Config,
	EdictRuneParams,
	EdictRuneResponse,
	TransferBTCResponse,
} from "@midl/core";
import { finalizeBTCTransaction } from "@midl/executor";
import {
	type MidlContextStore,
	useConfigInternal,
	useStoreInternal,
} from "@midl/react";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { StateOverride } from "viem";
import { usePublicClient } from "wagmi";

type FinalizeMutationVariables = {
	/**
	 * State override to estimate the cost of the transaction
	 */
	stateOverride?: StateOverride;

	/**
	 * Custom fee rate in sats/vB
	 */
	feeRate?: number;

	/**
	 * If true, skip the gas estimation for EVM transactions
	 */
	skipEstimateGas?: boolean;
	/**
	 * BTC address used to sign the transactions
	 */
	from?: string;

	/**
	 * Multisig address to use for the transaction.
	 * If not provided, the default multisig address for the current network will be used.
	 */
	multisigAddress?: string;

	/**
	 * Gas multiplier to apply to the estimated gas limit (default: 1.2).
	 */
	gasMultiplier?: number;

	/**
	 * Optional transfers to include in the transaction. This can be used to include additional rune or BTC transfers that are not derived from the intentions.
	 */
	transfers?: EdictRuneParams["transfers"];
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
			feeRate,
			skipEstimateGas,
			from,
			multisigAddress,
			gasMultiplier,
			transfers,
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
					feeRate,
					skipEstimateGas,
					from,
					multisigAddress,
					gasMultiplier,
					transfers,
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
