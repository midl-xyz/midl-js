import type { Config } from "@midl-xyz/midl-js-core";
import type { MidlContextState } from "@midl-xyz/midl-js-react";
import { JsonRpcProvider } from "ethers";
import { isHex, type Client } from "viem";
import { getTransactionCount } from "viem/actions";
import type { StoreApi } from "zustand";
import { getPublicKeyForAccount } from "~/actions/getPublicKeyForAccount";
import { signTransaction } from "~/actions/signTransaction";
import type { TransactionIntention } from "~/types/intention";
import { getEVMAddress } from "~/utils";

type SignIntentionOptions = {
	publicKey?: string;
	/**
	 * Next nonce of registered in EVM network, nonce is incremented by 1 for each transaction intention
	 */
	nonce?: number;

	gasPrice?: bigint;

	/**
	 * Transaction hash of the BTC transaction
	 */
	txId: string;
};

export const signIntention = async (
	config: Config,
	store: StoreApi<MidlContextState>,
	client: Client | JsonRpcProvider,
	intention: TransactionIntention,
	options: SignIntentionOptions,
) => {
	if (!config.network) {
		throw new Error("No network set");
	}

	const publicKey = await getPublicKeyForAccount(config, options.publicKey);

	if (!publicKey) {
		throw new Error("No public key set");
	}

	const evmAddress = getEVMAddress(publicKey);

	const getNonce = async () => {
		if (client instanceof JsonRpcProvider) {
			return client.getTransactionCount(evmAddress);
		}

		return getTransactionCount(client, {
			address: evmAddress,
		});
	};

	const nonce = options.nonce ?? (await getNonce());

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
