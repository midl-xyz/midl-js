import { type Config, waitForTransaction } from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type WaitForTransactionVariables = {
	/**
	 * The transaction ID to wait for.
	 */
	txId: string;
	/**
	 * The number of confirmations to wait for.
	 * Defaults to 1.
	 */
	confirmations?: number;
	/**
	 * Maximum number of attempts to check for transaction confirmation.
	 */
	maxAttempts?: number;
	/**
	 * Interval in milliseconds between attempts to check for transaction confirmation.
	 */
	intervalMs?: number;
};

type WaitForTransactionData = number;
type WaitForTransactionError = Error;

type UseWaitForTransactionParams = {
	/**
	 * Mutation options for the wait for transaction operation.
	 */
	mutation?: Omit<
		UseMutationOptions<
			WaitForTransactionData,
			WaitForTransactionError,
			WaitForTransactionVariables
		>,
		"mutationFn"
	>;
	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
};

/**
 * Waits for the transaction to be confirmed
 *
 * @example
 * ```typescript
 * const { waitForTransaction, isLoading } = useWaitForTransaction();
 *
 * // To wait for a transaction to confirm
 * waitForTransaction({ txId: 'tx-123', confirmations: 3 });
 * ```
 *
 * @param params Configuration options for the mutation.
 *
 * @returns
 * - `waitForTransaction`: `(variables: WaitForTransactionVariables) => void` – Function to initiate waiting for a transaction confirmation.
 * - `waitForTransactionAsync`: `(variables: WaitForTransactionVariables) => Promise<number>` – Function to asynchronously wait for a transaction confirmation.
 * - `isLoading`: `boolean` – Indicates if the mutation is currently loading.
 * - `error`: `Error | null` – Contains error information if the mutation failed.
 * - `data`: `number | undefined` – The number of confirmations once the transaction is confirmed.
 */
export const useWaitForTransaction = ({
	mutation,
	config: customConfig,
}: UseWaitForTransactionParams = {}) => {
	const config = useConfigInternal(customConfig);

	const { mutate, mutateAsync, ...rest } = useMutation<
		WaitForTransactionData,
		WaitForTransactionError,
		WaitForTransactionVariables
	>({
		mutationFn: async ({
			txId,
			confirmations = 1,
			maxAttempts,
			intervalMs,
		}) => {
			return waitForTransaction(config, txId, confirmations, {
				maxAttempts,
				intervalMs,
			});
		},
		...mutation,
	});

	return {
		waitForTransaction: mutate,
		waitForTransactionAsync: mutateAsync,
		...rest,
	};
};
