import {
	type Config,
	type SignMessageProtocol,
	getDefaultAccount,
} from "@midl-xyz/midl-js-core";
import { type Client, isHex } from "viem";
import { getTransactionCount } from "viem/actions";
import { getPublicKey } from "~/actions/getPublicKey";
import { signTransaction } from "~/actions/signTransaction";
import { GAS_PRICE } from "~/config";
import type { TransactionIntention } from "~/types/intention";
import { getBTCAddressByte, getEVMAddress } from "~/utils";

type SignIntentionOptions = {
	/**
	 * Public key of the account to use for signing
	 */
	publicKey?: string;
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
 *   - publicKey: Public key of the account to use for signing.
 *   - nonce: Next nonce registered in EVM network (optional).
 *   - txId: Transaction hash of the BTC transaction.
 *   - protocol: Protocol for signing the message (optional).
 * @returns The signed EVM transaction object.
 
 * @example
 * const signed = await signIntention(config, client, intention, intentions, { txId });
 */
export const signIntention = async (
	config: Config,
	client: Client,
	intention: TransactionIntention,
	intentions: TransactionIntention[],
	options: SignIntentionOptions,
) => {
	const { network } = config.getState();

	if (!network) {
		throw new Error("No network set");
	}

	const account = getDefaultAccount(
		config,
		options.publicKey ? (it) => it.publicKey === options.publicKey : undefined,
	);

	const publicKey = getPublicKey(account, network);

	if (!account || !publicKey) {
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

	intention.evmTransaction = {
		...intention.evmTransaction,
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

	const signed = await signTransaction(
		config,
		intention.evmTransaction,
		client,
		{
			nonce,
			protocol: options.protocol,
			publicKey: options.publicKey,
		},
	);

	return signed;
};
