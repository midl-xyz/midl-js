import {
	type Config,
	type SignMessageProtocol,
	getDefaultAccount,
	signMessage,
} from "@midl-xyz/midl-js-core";
import { JsonRpcProvider } from "ethers";
import {
	keccak256,
	type TransactionSerializableBTC,
	serializeTransaction,
	type Client,
} from "viem";
import { getTransactionCount } from "viem/actions";
import { getPublicKey } from "~/actions/getPublicKey";
import { extractEVMSignature, getBTCAddressByte, getEVMAddress } from "~/utils";

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
	const account = await getDefaultAccount(
		config,
		customPublicKey ? (it) => it.publicKey === customPublicKey : undefined,
	);

	if (client instanceof JsonRpcProvider) {
		throw new Error("Ethers provider is not supported");
	}

	const btcAddressByte = getBTCAddressByte(account);

	tx.btcAddressByte = btcAddressByte;

	// biome-ignore lint/style/noNonNullAssertion: client.chain is always defined
	const chainIdToUse = chainId || client.chain!.id;

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
