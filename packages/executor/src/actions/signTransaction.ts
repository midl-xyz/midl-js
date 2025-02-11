import {
	type Config,
	type SignMessageProtocol,
	getDefaultAccount,
	signMessage,
} from "@midl-xyz/midl-js-core";
import type { JsonRpcProvider } from "ethers";
import {
	keccak256,
	type TransactionSerializableBTC,
	serializeTransaction,
	type Client,
} from "viem";
import { getTransactionCount } from "viem/actions";
import { getPublicKey } from "~/actions/getPublicKey";
import {
	extractEVMSignature,
	getBTCAddressByte,
	getEVMAddress,
	getEVMFromBitcoinNetwork,
} from "~/utils";

type SignTransactionOptions = {
	publicKey?: string;
	nonce?: number;
	protocol?: SignMessageProtocol;
};

export const signTransaction = async (
	config: Config,
	{ chainId, ...tx }: TransactionSerializableBTC,
	client: Client | JsonRpcProvider,
	{ publicKey: customPublicKey, protocol, nonce }: SignTransactionOptions = {},
) => {
	if (!config.network) {
		throw new Error("No network set");
	}

	const account = await getDefaultAccount(
		config,
		customPublicKey ? (it) => it.publicKey === customPublicKey : undefined,
	);

	const btcAddressByte = getBTCAddressByte(account);

	tx.btcAddressByte = btcAddressByte;

	const chainIdToUse = chainId || getEVMFromBitcoinNetwork(config.network).id;

	const publicKey = getPublicKey(config, account.publicKey);

	if (!publicKey) {
		throw new Error("No public key found");
	}

	const getNonce = async () => {
		try {
			const { JsonRpcProvider } = await import("ethers");

			if (client instanceof JsonRpcProvider) {
				return client.getTransactionCount(getEVMAddress(publicKey));
			}
		} catch {}

		return getTransactionCount(client as Client, {
			address: getEVMAddress(publicKey),
		});
	};

	const lastNonce = nonce ?? (await getNonce());

	const serialized = serializeTransaction({
		nonce: lastNonce,
		type: "btc",
		chainId: chainIdToUse,
		...tx,
	});

	const data = await signMessage(config, {
		message: keccak256(serialized),
		address: account.address,
		protocol,
	});

	const { r, s, v } = extractEVMSignature(data.signature, account);
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
