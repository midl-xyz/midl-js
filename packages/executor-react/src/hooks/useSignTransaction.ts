// TODO: UNUSED HOOK - Remove if not needed
import { type Config, SignMessageProtocol } from "@midl-xyz/midl-js-core";
import { signTransaction } from "@midl-xyz/midl-js-executor";
import { useConfigInternal } from "@midl-xyz/midl-js-react";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { TransactionSerializableBTC } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

type SignTransactionParams = {
	tx: TransactionSerializableBTC;
};

type SignTransactionResult = `0x${string}`;

type SignTransactionError = Error;

type UseSignTransactionParams = {
	/**
	 * The address of the account to sign the transaction with.
	 */
	from?: string;
	/**
	 * The protocol to use for signing the message.
	 */
	protocol?: SignMessageProtocol;
	mutation: Omit<
		UseMutationOptions<
			SignTransactionResult,
			SignTransactionError,
			SignTransactionParams
		>,
		"mutationFn"
	>;
	config?: Config;
};

/**
 * Custom hook to sign a Bitcoin transaction.
 *
 * This hook provides functions to sign a BTC transaction using the connected wallet,
 * adhering to the specified signing protocol.
 *
 * @example
 * ```typescript
 * const { signTransaction, signTransactionAsync } = useSignTransaction({
 *   signer: 'senderAddress',
 *   protocol: SignMessageProtocol.Bip322,
 * });
 *
 * const signedTx = await signTransactionAsync({
 *   tx: {
 *     to: 'receiverAddress',
 *     value: 1000,
 *     // other transaction fields
 *   },
 * });
 * ```
 *
 * @returns
 * - **signTransaction**: `(variables: SignTransactionParams) => void` – Function to initiate transaction signing.
 * - **signTransactionAsync**: `(variables: SignTransactionParams) => Promise<SignTransactionResult>` – Function to asynchronously sign the transaction.
 * - Other mutation states such as `isLoading`, `error`, `data`, etc.
 */
export const useSignTransaction = (
	{
		mutation,
		from,
		protocol = SignMessageProtocol.Bip322,
		config: customConfig,
	}: UseSignTransactionParams = {
		mutation: {},
	},
) => {
	// TODO: Add support for other protocols
	if (protocol !== SignMessageProtocol.Bip322) {
		throw new Error("Only BIP322 protocol is supported");
	}

	const client = usePublicClient();
	const config = useConfigInternal(customConfig);

	const { mutate, mutateAsync, ...rest } = useMutation<
		SignTransactionResult,
		SignTransactionError,
		SignTransactionParams
	>({
		mutationFn: async ({ tx }) => {
			if (!client) {
				throw new Error("No client found");
			}

			return await signTransaction(config, tx, client, {
				from,
			});
		},
		...mutation,
	});

	return {
		signTransaction: mutate,
		signTransactionAsync: mutateAsync,
		...rest,
	};
};
