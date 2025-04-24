import {
	AddressPurpose,
	SignMessageProtocol,
	connect,
	disconnect,
	getDefaultAccount,
	signMessage,
} from "@midl-xyz/midl-js-core";
import { schnorr } from "@noble/secp256k1";
import { OutScript, Transaction, p2wpkh } from "@scure/btc-signer";
import { BIP322 } from "bip322-js";
import { magicHash } from "bitcoinjs-message";
import { publicKeyConvert } from "secp256k1";
import { hexToBigInt, keccak256, recoverPublicKey } from "viem";
import { afterEach, describe, expect, it } from "vitest";
import { midlConfig, midlConfigP2SH } from "~/__tests__/midlConfig";
import { getPublicKeyForAccount } from "~/actions";
import { extractEVMSignature } from "~/utils/extractEVMSignature";

describe("extractEVMSignature", () => {
	afterEach(async () => {
		await disconnect(midlConfig);
		await disconnect(midlConfigP2SH);
	});

	it("extracts evm signature using p2sh(p2wpkh) address and ecdsa", async () => {
		await connect(midlConfigP2SH, {
			purposes: [AddressPurpose.Payment],
		});

		const account = await getDefaultAccount(midlConfigP2SH);

		const message = keccak256(new TextEncoder().encode("test"));

		const { signature, protocol } = await signMessage(midlConfigP2SH, {
			protocol: SignMessageProtocol.Ecdsa,
			message: message,
			address: account.address,
		});

		const { r, s, v } = extractEVMSignature(
			signature,
			protocol,
			account.addressType,
		);

		const recovered = await recoverPublicKey({
			hash: magicHash(message),
			signature: {
				r,
				s,
				v,
			},
		});

		expect(
			Buffer.from(
				publicKeyConvert(Buffer.from(recovered.slice(2), "hex"), true),
			).toString("hex"),
		).toEqual(account.publicKey);
	});

	it.skip("extracts evm signature using p2sh(p2wpkh) address and bip322", async () => {
		await connect(midlConfigP2SH, {
			purposes: [AddressPurpose.Payment],
		});

		const account = await getDefaultAccount(midlConfigP2SH);

		const message = keccak256(new TextEncoder().encode("test"));

		const { signature, protocol } = await signMessage(midlConfigP2SH, {
			protocol: SignMessageProtocol.Bip322,
			message: message,
			address: account.address,
		});

		const { r, s, v } = extractEVMSignature(
			signature,
			protocol,
			account.addressType,
		);

		const pk = await getPublicKeyForAccount(midlConfig);

		const recovered = await recoverPublicKey({
			hash: getBIP322HashP2WPKH(message, account.publicKey),
			signature: {
				r,
				s,
				v,
			},
		});

		expect(
			Buffer.from(
				publicKeyConvert(Buffer.from(recovered.slice(2), "hex"), true),
			).toString("hex"),
		).toEqual(pk.substring(2));
	});

	it("extracts evm signature using p2wpkh address and ecdsa", async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Payment],
		});

		const account = await getDefaultAccount(midlConfig);

		const message = keccak256(new TextEncoder().encode("test"));

		const { signature, protocol } = await signMessage(midlConfig, {
			protocol: SignMessageProtocol.Ecdsa,
			message: message,
			address: account.address,
		});

		const { r, s, v } = extractEVMSignature(
			signature,
			protocol,
			account.addressType,
		);

		const recovered = await recoverPublicKey({
			hash: magicHash(message),
			signature: {
				r,
				s,
				v,
			},
		});

		expect(
			Buffer.from(
				publicKeyConvert(Buffer.from(recovered.slice(2), "hex"), true),
			).toString("hex"),
		).toEqual(account.publicKey);
	});

	it("extracts evm signature using p2wpkh address and bip322", async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Payment],
		});

		const account = await getDefaultAccount(midlConfig);

		const message = keccak256(new TextEncoder().encode("test"));

		const { signature, protocol } = await signMessage(midlConfig, {
			protocol: SignMessageProtocol.Bip322,
			message: message,
			address: account.address,
		});

		const { r, s, v } = extractEVMSignature(
			signature,
			protocol,
			account.addressType,
		);

		const pk = await getPublicKeyForAccount(midlConfig);
		// To determine correct recovery id first try 27 and do recoverPublicKey check before sending transactions, if check fails, then try 28
		/* correctly extracted signature from response signature according to DER
			02483045022100d18c49cb93cadad374d14653d6530e22b5bc5cd7e59fc1acb800f6ec676af1850220015a9d101db6656ccba3cc8520b3661b4bed87de5080b2a1f9e8eb92a6389f12012102d89648524138dca33a14822646a036e3107f0297f948c36aaf696f5e59c36d7f
		const recovered = await recoverPublicKey({
			hash: getBIP322HashP2WPKH(message, account.publicKey),
			signature: {
				r: BigInt('0xd18c49cb93cadad374d14653d6530e22b5bc5cd7e59fc1acb800f6ec676af185'),
				s: BigInt('0x015a9d101db6656ccba3cc8520b3661b4bed87de5080b2a1f9e8eb92a6389f12'),
				v: 28n,
			},
		});*/
		console.log(r);
		console.log(s);
		const recovered = await recoverPublicKey({
			hash: getBIP322HashP2WPKH(message, account.publicKey),
			signature: {
				r,
				s,
				v, // v: 28n works
			},
		});

		expect(
			Buffer.from(
				publicKeyConvert(Buffer.from(recovered.slice(2), "hex"), true),
			).toString("hex").substring(2),
		).toEqual(pk.substring(2));
	});

	it("extract evm signature using p2tr address and bip322", async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});

		const account = await getDefaultAccount(midlConfig);

		const message = keccak256(new TextEncoder().encode("test"));

		const { signature, protocol } = await signMessage(midlConfig, {
			protocol: SignMessageProtocol.Bip322,
			message: message,
			address: account.address,
		});

		const { r, s } = extractEVMSignature(
			signature,
			protocol,
			account.addressType,
		);

		const pk = await getPublicKeyForAccount(midlConfig);

		const valid = await schnorr.verify(
			new schnorr.Signature(hexToBigInt(r), hexToBigInt(s)).toHex(),
			getBIP322HashP2TR(message, pk.substring(2)),
			Buffer.from(pk.substring(2), "hex"),
		);

		expect(valid).toBeTruthy();
	});
});

function getBIP322HashP2TR(message: string, publicKey: string) {
	const scriptPubKey = new Uint8Array(34);
	const publicKeyBuffer = Buffer.from(publicKey, "hex");

	scriptPubKey[0] = 0x51;
	scriptPubKey[1] = 0x20;
	scriptPubKey.set(publicKeyBuffer, 2);

	const toSpendTx = BIP322.buildToSpendTx(message, Buffer.from(scriptPubKey));

	const toSignTx = BIP322.buildToSignTx(
		toSpendTx.getId(),
		Buffer.from(scriptPubKey),
		false,
		publicKeyBuffer,
	);
	const tx = Transaction.fromPSBT(toSignTx.toBuffer());

	return tx.preimageWitnessV1(0, [scriptPubKey], 0, [0n]);
}

function getBIP322HashP2WPKH(message: string, publicKey: string) {
	const publicKeyBuffer = Buffer.from(publicKey, "hex");

	const scriptPubKey = p2wpkh(publicKeyBuffer).script;

	const toSpendTx = BIP322.buildToSpendTx(message, Buffer.from(scriptPubKey));

	const toSignTx = BIP322.buildToSignTx(
		toSpendTx.getId(),
		Buffer.from(scriptPubKey),
	);
	toSignTx.updateInput(0, {
		sighashType: 1,
	});

	const tx = Transaction.fromPSBT(toSignTx.toBuffer());

	const signingScript = OutScript.encode({
		type: "pkh",
		hash: scriptPubKey.slice(2),
	});

	return tx.preimageWitnessV0(0, signingScript, 1, 0n);
}
