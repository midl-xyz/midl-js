import {
	type Config,
	type SignMessageProtocol,
	getDefaultAccount,
	signMessage,
} from "@midl-xyz/midl-js-core";
import {
	type Client,
	type TransactionSerializableBTC,
	keccak256,
	serializeTransaction,
} from "viem";
import { getTransactionCount } from "viem/actions";
import { getPublicKey } from "~/actions/getPublicKey";
import { extractEVMSignature, getEVMAddress } from "~/utils";

/**
 * Options for signing a transaction.
 */
type SignTransactionOptions = {
	/**
	 * BTC address used to sign the transactions.
	 */
	from?: string;
	/**
	 * Next nonce of registered in EVM network, nonce is incremented by 1 for each transaction intention.
	 */
	nonce?: number;
	/**
	 * Transaction hash of the BTC transaction.
	 */
	protocol?: SignMessageProtocol;
};

/**
 * Signs an EVM transaction using the provided configuration and options.
 *
 * @param config - The configuration object.
 * @param tx - The transaction to sign (TransactionSerializableBTC).
 * @param client - EVM client or provider.
 * @param options - Options for signing the transaction
 * @returns The signed and serialized transaction as a hex string.
 *
 * @example
 * const signedTx = await signTransaction(config, tx, client, { publicKey, protocol });
 */
export const signTransaction = async (
	config: Config,
	{ chainId, ...tx }: TransactionSerializableBTC,
	client: Client,
	{ from, protocol, nonce }: SignTransactionOptions = {},
) => {
	const { network } = config.getState();

	if (!network) {
		throw new Error("No network set");
	}

	const account = getDefaultAccount(
		config,
		from ? (it) => it.address === from : undefined,
	);

	const chainIdToUse = chainId || client.chain?.id;

	if (!chainIdToUse) {
		throw new Error("No chain ID found");
	}

	const publicKey = getPublicKey(account, network);

	if (!publicKey) {
		throw new Error("No public key found");
	}

	const lastNonce =
		nonce ??
		(await getTransactionCount(client, {
			address: getEVMAddress(account, network),
		}));

	const serialized = serializeTransaction({
		nonce: lastNonce,
		type: "btc",
		chainId: chainIdToUse,
		...tx,
	});

	const message = keccak256(serialized);

	const data = await signMessage(config, {
		message,
		address: account.address,
		protocol,
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
		{
			...tx,
			chainId: chainIdToUse,
		},
		{
			r,
			s,
			v,
		},
	);

	return signedSerializedTransaction;
};
