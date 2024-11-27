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
