import { type Config, broadcastTransaction } from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfigInternal } from "~/hooks/useConfigInternal";

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
	config?: Config;
};

/**
 * Broadcasts a transaction to Bitcoin network.
 * *
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
 * @param params - Configuration options for the mutation.
 *
 * @returns
 * - **broadcastTransaction**: `(variables: UseBroadcastTransactionVariables) => void` – Function to initiate broadcasting a transaction.
 * - **broadcastTransactionAsync**: `(variables: UseBroadcastTransactionVariables) => Promise<UseBroadcastTransactionData>` – Function to asynchronously broadcast a transaction.
 */
export const useBroadcastTransaction = ({
	mutation,
	config: customConfig,
}: UseBroadcastTransactionParams = {}) => {
	const config = useConfigInternal(customConfig);

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
