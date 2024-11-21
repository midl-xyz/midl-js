import { SignMessageProtocol } from "@midl-xyz/midl-js-core";
import { useAccounts, useSignMessage } from "@midl-xyz/midl-js-react";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
	keccak256,
	toHex,
	serializeTransaction as viemSerializeTransaction,
	type TransactionSerializableBTC,
} from "viem";
import { useSerializeTransaction } from "~/hooks/useSerializeTransaction";

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
			const serialized = await serializeTransaction(tx);

			const account =
				accounts?.find((it) => it.address === signer) ??
				paymentAccount ??
				ordinalsAccount;

			if (!account) {
				throw new Error("No account found");
			}

			const data = await signMessageAsync({
				message: keccak256(serialized),
				address: account?.address,
				protocol,
			});

			const signatureBuffer = Buffer.from(data.signature, "base64").slice(2);

			let recoveryId = 27n;

			if (account.address === paymentAccount?.address) {
				const firstByte = Uint8Array.prototype.slice.call(
					Buffer.from(account.publicKey, "hex"),
					0,
					1,
				);

				recoveryId = BigInt(firstByte[0]) + 27n;
			}

			const r = Uint8Array.prototype.slice.call(signatureBuffer, 0, 32);
			const s = Uint8Array.prototype.slice.call(signatureBuffer, 32, 64);

			const signedSerializedTransaction = viemSerializeTransaction(
				{
					...tx,
				},
				{
					r: toHex(r),
					s: toHex(s),
					v: recoveryId,
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
