import { SignMessageProtocol } from "@midl-xyz/midl-js-core";
import { useConfig } from "@midl-xyz/midl-js-react";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { TransactionSerializableBTC } from "viem";
import { useWalletClient } from "wagmi";
import { signTransaction } from "~/actions";

type SignTransactionParams = {
	tx: TransactionSerializableBTC;
};

type SignTransactionResult = `0x${string}`;

type SignTransactionError = Error;

type UseSignTransactionParams = {
	/**
	 * The public key to use for signing the transaction.
	 */
	publicKey?: string;
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
		publicKey,
		protocol = SignMessageProtocol.Bip322,
	}: UseSignTransactionParams = {
		mutation: {},
	},
) => {
	// TODO: Add support for other protocols
	if (protocol !== SignMessageProtocol.Bip322) {
		throw new Error("Only BIP322 protocol is supported");
	}

	const { data: client } = useWalletClient();
	const config = useConfig();

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
				publicKey,
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
