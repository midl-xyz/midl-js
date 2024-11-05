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
	{ mutation }: UseSignTransactionParams = {
		mutation: {},
	},
) => {
	const { signMessageAsync } = useSignMessage();
	const { ordinalsAccount } = useAccounts();
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

			const data = await signMessageAsync({
				message: keccak256(serialized),
				address: ordinalsAccount?.address,
				protocol: SignMessageProtocol.Bip322,
			});

			const signatureBuffer = Buffer.from(data.signature, "base64").slice(2);

			const recoveryId = 27n;

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
