import {
	type Config,
	type SignMessageProtocol,
	getDefaultAccount,
	signMessage,
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

/**
 * Signs the intention with the given options. The intention is signed as a generic Bitcoin message.
 *
 * @param config - The configuration object.
 * @param client - EVM client or provider.
 * @param intention - The intention to sign.
 * @param intentions - The list of intentions to sign (used for nonce calculation).
 * @param options - The options for signing:
 *   - from: BTC address used to sign the transactions (optional).
 *   - nonce: Next nonce registered in EVM network (optional).
 *   - txId: Transaction hash of the BTC transaction.
 *   - protocol: Protocol for signing the message (optional).
 * @returns The signed EVM transaction object.
 *
 * @example
 * const signed = await signIntention(config, client, intention, intentions, { txId });
 */
export const signIntention = async (
	config: Config,
	client: PublicClient | WalletClient,
	intention: TransactionIntention,
	intentions: TransactionIntention[],
	options: SignIntentionOptions,
) => {
	const { serialized, intention: clonedIntention } = await serializeIntention(
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

	if (!clonedIntention.evmTransaction) {
		throw new Error("No EVM transaction set");
	}

	const account = getDefaultAccount(
		config,
		options.from ? (it) => it.address === options.from : undefined,
	);

	const message = keccak256(serialized);

	const data = await signMessage(config, {
		message,
		address: account.address,
		protocol: options.protocol,
	});

	const { r, s, v } = await extractEVMSignature(
		message,
		data.signature,
		data.protocol,
		{
			addressType: account.addressType,
			publicKey: account.publicKey,
		},
	);

	const signedSerializedTransaction = serializeTransaction(
		clonedIntention.evmTransaction,
		{
			r,
			s,
			v,
		},
	);

	return signedSerializedTransaction;
};
