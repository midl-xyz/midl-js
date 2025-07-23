import {
	type Config,
	type SignMessageProtocol,
	getDefaultAccount,
	signMessage,
} from "@midl-xyz/midl-js-core";
import { type Client, keccak256, serializeTransaction } from "viem";
import { getTransactionCount } from "viem/actions";
import { getPublicKey } from "~/actions/getPublicKey";
import type { TransactionIntention } from "~/types";
import { extractEVMSignature, getEVMAddress } from "~/utils";

type SignTransactionOptions = {
	publicKey?: string;
	nonce?: number;
	protocol?: SignMessageProtocol;
};

export const signTransaction = async (
	config: Config,
	{ chainId, ...tx }: TransactionIntention["evmTransaction"],
	client: Client,
	{ publicKey: customPublicKey, protocol, nonce }: SignTransactionOptions = {},
) => {
	const { network } = config.getState();

	if (!network) {
		throw new Error("No network set");
	}

	const account = getDefaultAccount(
		config,
		customPublicKey ? (it) => it.publicKey === customPublicKey : undefined,
	);

	const chainIdToUse = chainId || client.chain?.id;

	if (!chainIdToUse) {
		throw new Error("No chain ID found");
	}

	const publicKey = getPublicKey(config, account.publicKey);

	if (!publicKey) {
		throw new Error("No public key found");
	}

	const lastNonce =
		nonce ??
		(await getTransactionCount(client, {
			address: getEVMAddress(config, account),
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
