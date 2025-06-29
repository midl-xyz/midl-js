import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type {
	SendBTCTransactionsParameter,
	SendBTCTransactionsReturnType,
} from "viem";
import { useWalletClient } from "wagmi";

type SendBTCTransactionsData = Awaited<SendBTCTransactionsReturnType>;
type SendBTCTransactionsError = Error;
type SendBTCTransactionsVariables = SendBTCTransactionsParameter;

type useSendBTCTransactionsParams = {
	mutation?: Omit<
		UseMutationOptions<
			SendBTCTransactionsData,
			SendBTCTransactionsError,
			SendBTCTransactionsVariables
		>,
		"mutationFn"
	>;
};

export const useSendBTCTransactions = ({
	mutation: mutationParams,
}: useSendBTCTransactionsParams = {}) => {
	const { data: walletClient } = useWalletClient();

	const mutation = useMutation<
		SendBTCTransactionsData,
		SendBTCTransactionsError,
		SendBTCTransactionsVariables
	>({
		mutationFn: (params) => {
			if (!walletClient) {
				throw new Error("Wallet client is not available");
			}

			return walletClient.sendBTCTransactions({
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
