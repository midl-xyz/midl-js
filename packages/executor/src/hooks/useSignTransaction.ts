import { SignMessageProtocol } from "@midl-xyz/midl-js-core";
import { useAccounts, useSignMessage } from "@midl-xyz/midl-js-react";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
	type TransactionSerializableBTC,
	keccak256,
	serializeTransaction as viemSerializeTransaction,
} from "viem";
import { useSerializeTransaction } from "~/hooks/useSerializeTransaction";
import { extractEVMSignature, getBTCAddressByte } from "~/utils";

type SignTransactionParams = {
	tx: TransactionSerializableBTC;
};

type SignTransactionResult = `0x${string}`;

type SignTransactionError = Error;

type UseSignTransactionParams = {
	/**
	 * The address of the account to sign the transaction with.
	 */
	signer?: string;
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
 * @param {UseSignTransactionParams} params - Configuration options for signing the transaction.
 * @param {string} [params.signer] - The address of the account to sign the transaction with. If not provided, defaults to the connected payment or ordinals account.
 * @param {SignMessageProtocol} [params.protocol=SignMessageProtocol.Bip322] - The protocol to use for signing the message.
 * @param {UseMutationOptions} [params.mutation] - Additional mutation options.
 *
 * @returns
 * - **signTransaction**: `(variables: SignTransactionParams) => void` – Function to initiate transaction signing.
 * - **signTransactionAsync**: `(variables: SignTransactionParams) => Promise<SignTransactionResult>` – Function to asynchronously sign the transaction.
 * - Other mutation states such as `isLoading`, `error`, `data`, etc.
 */
export const useSignTransaction = (
	{
		mutation,
		signer,
		protocol = SignMessageProtocol.Bip322,
	}: UseSignTransactionParams = {
		mutation: {},
	},
) => {
	// TODO: Add support for other protocols
	if (protocol !== SignMessageProtocol.Bip322) {
		throw new Error("Only BIP322 protocol is supported");
	}

	const { signMessageAsync } = useSignMessage();
	const { paymentAccount, ordinalsAccount, accounts } = useAccounts();
	const serializeTransaction = useSerializeTransaction({
		shouldIncrementNonce: false,
	});

	const { mutate, mutateAsync, ...rest } = useMutation<
		SignTransactionResult,
		SignTransactionError,
		SignTransactionParams
	>({
		mutationFn: async ({ tx }) => {
			const account =
				accounts?.find((it) => it.address === signer) ??
				paymentAccount ??
				ordinalsAccount;

			if (!account) {
				throw new Error("No account found");
			}

			const btcAddressByte = getBTCAddressByte(account);

			tx.btcAddressByte = btcAddressByte;

			const serialized = await serializeTransaction(tx);

			const data = await signMessageAsync({
				message: keccak256(serialized),
				address: account.address,
				protocol,
			});

			const { r, s, v } = extractEVMSignature(data.signature, account);
			const signedSerializedTransaction = viemSerializeTransaction(
				{
					...tx,
				},
				{
					r,
					s,
					v,
				},
			);

			return signedSerializedTransaction;
		},
		...mutation,
	});

	return {
		signTransaction: mutate,
		signTransactionAsync: mutateAsync,
		...rest,
	};
};
