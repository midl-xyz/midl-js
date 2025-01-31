import { waitForTransaction } from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

type WaitForTransactionVariables = {
	txId: string;
	confirmations?: number;
	maxAttempts?: number;
	intervalMs?: number;
};

type WaitForTransactionData = number;
type WaitForTransactionError = Error;

type UseWaitForTransactionParams = {
	mutation?: Omit<
		UseMutationOptions<
			WaitForTransactionData,
			WaitForTransactionError,
			WaitForTransactionVariables
		>,
		"mutationFn"
	>;
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
}: UseWaitForTransactionParams = {}) => {
	const config = useConfig();

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
