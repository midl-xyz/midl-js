import { type Config, getDefaultAccount } from "@midl/core";
import {
	type PublicClient,
	type WalletClient,
	isHex,
	serializeTransaction,
} from "viem";
import { getTransactionCount } from "viem/actions";
import { getPublicKey } from "~/actions";
import { GAS_PRICE } from "~/config";
import type { TransactionIntention } from "~/types";
import { getBTCAddressByte, getEVMAddress } from "~/utils";

type PrepareIntentionOptions = {
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
};

/**
 * Prepares and serializes an intention for signing.
 *
 * @param config - The configuration object.
 * @param client - EVM client or provider.
 * @param intention - The intention to serialize.
 * @param intentions - The list of intentions to serialize (used for nonce calculation).
 * @param options - The options for serialization
 * @returns Serialized transaction, its hash, and the cloned intention.
 *
 * @example
 * const serialized = await serializeIntention(config, client, intention, intentions, { txId });
 */
export const serializeIntention = async (
	config: Config,
	client: PublicClient | WalletClient,
	intention: TransactionIntention,
	intentions: TransactionIntention[],
	options: PrepareIntentionOptions,
) => {
	const { network } = config.getState();

	if (!network) {
		throw new Error("No network set");
	}

	const account = getDefaultAccount(
		config,
		options.from ? (it) => it.address === options.from : undefined,
	);

	const publicKey = getPublicKey(account, network);

	if (publicKey === null) {
		throw new Error("No public key set");
	}

	const evmAddress = getEVMAddress(account, network);

	const nonce =
		options.nonce ??
		(await getTransactionCount(client, {
			address: evmAddress,
		}));

	if (!intentions) {
		throw new Error("No intentions found");
	}

	if (!intention.evmTransaction) {
		throw new Error("No EVM transaction set");
	}

	if (!client.chain) {
		throw new Error("No EVM chain set");
	}

	const clonedIntention = structuredClone(intention);

	clonedIntention.evmTransaction = {
		...clonedIntention.evmTransaction,
		chainId: client.chain.id,
		from: intention.evmTransaction.from ?? evmAddress,
		nonce:
			nonce +
			intentions
				.filter((it) => Boolean(it.evmTransaction))
				.findIndex((it) => it === intention),
		gasPrice: GAS_PRICE,
		publicKey,
		btcAddressByte: getBTCAddressByte(account),
		btcTxHash: isHex(options.txId, { strict: false })
			? options.txId
			: `0x${options.txId}`,
	};

	const serialized = serializeTransaction(clonedIntention.evmTransaction);

	return {
		serialized,
		intention: clonedIntention,
	};
};
