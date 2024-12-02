import { broadcastTransaction } from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

type UseBroadcastTransactionVariables = {
	tx: string;
};

type UseBroadcastTransactionError = Error;

type UseBroadcastTransactionData = string;

type UseBroadcastTransactionParams = {
	mutation?: Omit<
		UseMutationOptions<
			UseBroadcastTransactionData,
			UseBroadcastTransactionError,
			UseBroadcastTransactionVariables
		>,
		"mutationFn"
	>;
};

/**
 * Custom hook to broadcast a transaction to Bitcoin network.
 *
 * This hook provides functions to broadcast a transaction and handle its asynchronous operation.
 *
 * @example
 * ```typescript
 * const { broadcastTransaction, broadcastTransactionAsync } = useBroadcastTransaction();
 * 
 * // To broadcast a transaction
 * broadcastTransaction({ tx: 'transaction_data' });
 * 
 * // To broadcast a transaction asynchronously
 * await broadcastTransactionAsync({ tx: 'transaction_data' });
 * ```
 *
 * @param {UseBroadcastTransactionParams} [params] - Configuration options for the mutation.
 *
 * @returns
 * - **broadcastTransaction**: `(variables: UseBroadcastTransactionVariables) => void` – Function to initiate broadcasting a transaction.
 * - **broadcastTransactionAsync**: `(variables: UseBroadcastTransactionVariables) => Promise<UseBroadcastTransactionData>` – Function to asynchronously broadcast a transaction.
 * - **isLoading**: `boolean` – Indicates if the mutation is currently loading.
 * - **error**: `UseBroadcastTransactionError | null` – Contains error information if the mutation failed.
 * - **data**: `UseBroadcastTransactionData | undefined` – The response data from the broadcast operation.
 */
export const useBroadcastTransaction = ({
	mutation,
}: UseBroadcastTransactionParams = {}) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...rest } = useMutation<
		UseBroadcastTransactionData,
		UseBroadcastTransactionError,
		UseBroadcastTransactionVariables
	>({
		mutationFn: async ({ tx }) => {
			return broadcastTransaction(config, tx);
		},
		...mutation,
	});

	return {
		broadcastTransaction: mutate,
		broadcastTransactionAsync: mutateAsync,
		...rest,
	};
};
