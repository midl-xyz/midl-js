import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type {
	SendBTCTransactionsParameter,
	SendBTCTransactionsReturnType,
} from "viem";
import { usePublicClient } from "wagmi";

type SendBTCTransactionsData = Awaited<SendBTCTransactionsReturnType>;
type SendBTCTransactionsError = Error;
type SendBTCTransactionsVariables = SendBTCTransactionsParameter;

type UseSendBTCTransactionsParams = {
	/**
	 * Mutation options for React Query.
	 */
	mutation?: Omit<
		UseMutationOptions<
			SendBTCTransactionsData,
			SendBTCTransactionsError,
			SendBTCTransactionsVariables
		>,
		"mutationFn"
	>;
};

/**
 * Sends batch of MIDL transactions. Expects the `serializedTransactions` to be an array of signed serialized MIDL transactions and `btcTransaction` to be a signed Bitcoin transaction hex.
 *
 * @returns An object with `sendBTCTransactions`, `sendBTCTransactionsAsync`, and mutation state from React Query.
 *
 * @example
 * const { sendBTCTransactions } = useSendBTCTransactions();
 * sendBTCTransactions({ serializedTransactions, btcTransaction });
 */
export const useSendBTCTransactions = ({
	mutation: mutationParams,
}: UseSendBTCTransactionsParams = {}) => {
	const publicClient = usePublicClient();

	const mutation = useMutation<
		SendBTCTransactionsData,
		SendBTCTransactionsError,
		SendBTCTransactionsVariables
	>({
		mutationFn: (params) => {
			if (!publicClient) {
				throw new Error("Wallet client is not available");
			}

			return publicClient.sendBTCTransactions({
				serializedTransactions: params.serializedTransactions,
				btcTransaction: params.btcTransaction,
			});
		},
		...mutationParams,
	});

	return {
		sendBTCTransactions: mutation.mutate,
		sendBTCTransactionsAsync: mutation.mutateAsync,
		...mutation,
	};
};
