import type { Config, SignMessageProtocol } from "@midl-xyz/midl-js-core";
import type { MidlContextState } from "@midl-xyz/midl-js-react";
import { isHex, type Client } from "viem";
import { getTransactionCount } from "viem/actions";
import type { StoreApi } from "zustand";
import { getPublicKey } from "~/actions/getPublicKey";
import { getPublicKeyForAccount } from "~/actions/getPublicKeyForAccount";
import { signTransaction } from "~/actions/signTransaction";
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
	 * Gas price for EVM transactions
	 */
	gasPrice?: bigint;

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
 * Signs the intention with the given options. The intentions is signed as generic Bitcoin message.
 *
 * @param config The configuration object
 * @param store The store object
 * @param client EVM client or provider
 * @param intention The intention to sign
 * @param options The options for signing
 * @returns
 */
export const signIntention = async (
	config: Config,
	store: StoreApi<MidlContextState>,
	client: Client,
	intention: TransactionIntention,
	options: SignIntentionOptions,
) => {
	const { network, accounts } = config.getState();

	if (!network) {
		throw new Error("No network set");
	}

	const publicKey = await getPublicKeyForAccount(config, options.publicKey);

	const account = accounts?.find(
		async (it) =>
			(await getPublicKeyForAccount(config, it.publicKey)) ===
			options.publicKey,
	);

	if (!account) {
		throw new Error("No public key set");
	}

	const evmAddress = getEVMAddress(publicKey);

	const nonce =
		options.nonce ??
		(await getTransactionCount(client, {
			address: evmAddress,
		}));

	const intentions = store.getState().intentions;

	if (!intentions) {
		throw new Error("No intentions found");
	}

	if (!intention.evmTransaction) {
		throw new Error("No EVM transaction set");
	}

	intention.evmTransaction = {
		...intention.evmTransaction,

		nonce:
			nonce +
			intentions
				.filter((it) => Boolean(it.evmTransaction))
				.findIndex((it) => it === intention),
		gasPrice: options.gasPrice,
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

	store.setState({
		intentions: intentions.map((it) => {
			if (it === intention) {
				return {
					...it,
					signedEvmTransaction: signed,
				};
			}

			return it;
		}),
	});

	return signed;
};
