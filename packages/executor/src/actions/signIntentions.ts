import {
	type Config,
	type SignMessageProtocol,
	getDefaultAccount,
	signMessage,
	signMessages,
} from "@midl/core";
import {
	type PublicClient,
	type WalletClient,
	keccak256,
	serializeTransaction,
} from "viem";
import { serializeIntention } from "~/actions/serializeIntention";
import type { TransactionIntention } from "~/types/intention";
import { extractEVMSignature } from "~/utils";

type SignIntentionOptions = {
	/**
	 * BTC address used to sign the transactions
	 */
	from?: string;
	/**
	 * Next nonce of registered in EVM network, nonce is incremented by 1 for each transaction intention
	 */
	nonce?: number;

	/**
	 * Transaction hash of the BTC transaction
	 */
	txId: string;
	/**
	 * Protocol for signing the message
	 */
	protocol?: SignMessageProtocol;
};

export const signIntentions = async (
	config: Config,
	client: PublicClient | WalletClient,
	intentions: TransactionIntention[],
	options: SignIntentionOptions,
) => {
	const serializedIntentions = [];

	for (const intention of intentions) {
		const serializedIntention = await serializeIntention(
			config,
			client,
			intention,
			intentions,
			{
				from: options.from,
				nonce: options.nonce,
				txId: options.txId,
			},
		);

		serializedIntentions.push(serializedIntention);
	}

	const account = getDefaultAccount(
		config,
		options.from ? (it) => it.address === options.from : undefined,
	);

	const signedMessages = await signMessages(
		config,
		serializedIntentions.map((it) => ({
			message: keccak256(it.serialized),
			address: account.address,
			protocol: options.protocol,
		})),
	);

	const signedSerializedTransactions: `0x07${string}`[] = [];

	for (let i = 0; i < intentions.length; i++) {
		const { intention, serialized } = serializedIntentions[i];
		const data = signedMessages[i];

		if (!intention.evmTransaction) {
			throw new Error("No EVM transaction set");
		}

		const { r, s, v } = await extractEVMSignature(
			keccak256(serialized),
			data.signature,
			data.protocol,
			{
				addressType: account.addressType,
				publicKey: account.publicKey,
			},
		);
		const signedSerializedTransaction = serializeTransaction(
			intention.evmTransaction,
			{
				r,
				s,
				v,
			},
		);

		signedSerializedTransactions.push(signedSerializedTransaction);
	}

	return signedSerializedTransactions;
};
