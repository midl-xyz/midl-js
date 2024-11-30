import { SignMessageProtocol, AddressType, getAddressType } from "@midl-xyz/midl-js-core";
import { useAccounts, useSignMessage } from "@midl-xyz/midl-js-react";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
	type TransactionSerializableBTC,
	keccak256,
	serializeTransaction as viemSerializeTransaction,
} from "viem";
import { useSerializeTransaction } from "~/hooks/useSerializeTransaction";
import { extractEVMSignature } from "~/utils";

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

			const account =
				accounts?.find((it) => it.address === signer) ??
				paymentAccount ??
				ordinalsAccount;

			if (!account) {
				throw new Error("No account found");
			}

			if (getAddressType(account.address) == AddressType.P2WPKH) {
				const btcAddressByte = Uint8Array.prototype.slice.call(
					Buffer.from(account.publicKey, "hex"),
					0,
					1,
				);
				tx.btcAddressByte = BigInt(btcAddressByte[0])
			}
			const serialized = await serializeTransaction(tx);

			const data = await signMessageAsync({
				message: keccak256(serialized),
				address: account.address,
				protocol,
			});

			const { r, s, v } = extractEVMSignature(
				data.signature,
				account,
			);
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
