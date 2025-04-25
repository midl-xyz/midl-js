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
import {
	extractEVMSignature,
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
	client: Client,
	{ publicKey: customPublicKey, protocol, nonce }: SignTransactionOptions = {},
) => {
	const { network } = config.getState();

	if (!network) {
		throw new Error("No network set");
	}

	const account = await getDefaultAccount(
		config,
		customPublicKey ? (it) => it.publicKey === customPublicKey : undefined,
	);

	const chainIdToUse = chainId || getEVMFromBitcoinNetwork(network).id;

	const publicKey = getPublicKey(config, account.publicKey);

	if (!publicKey) {
		throw new Error("No public key found");
	}

	const lastNonce =
		nonce ??
		(await getTransactionCount(client, {
			address: getEVMAddress(publicKey),
		}));

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

	const { r, s, v } = extractEVMSignature(
		data.signature,
		data.protocol,
		account.addressType,
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
