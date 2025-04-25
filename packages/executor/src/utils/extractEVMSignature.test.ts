import {
	AddressPurpose,
	SignMessageProtocol,
	connect,
	disconnect,
	getDefaultAccount,
	signMessage,
} from "@midl-xyz/midl-js-core";
import { schnorr, Signature } from "@noble/secp256k1";
import {
	OutScript,
	SigHash,
	Transaction,
	p2sh,
	p2wpkh,
} from "@scure/btc-signer";
import { hash160 } from "@scure/btc-signer/utils";
import { BIP322, Verifier } from "bip322-js";
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

	it("extracts evm signature using p2sh(p2wpkh) address and bip322", async () => {
		await connect(midlConfigP2SH, {
			purposes: [AddressPurpose.Payment],
		});

		const account = await getDefaultAccount(midlConfigP2SH);
		const pk = await getPublicKeyForAccount(midlConfigP2SH);

		const message = keccak256(new TextEncoder().encode("test"));

		const { signature, protocol } = await signMessage(midlConfigP2SH, {
			protocol: SignMessageProtocol.Bip322,
			message: message,
			address: account.address,
		});

		const isValid = Verifier.verifySignature(
			account.address,
			message,
			signature,
		);

		const { r, s, v } = extractEVMSignature(
			signature,
			protocol,
			account.addressType,
		);

		const recovered = await recoverPublicKey({
			hash: getBIP322HashP2SHP2WPKH(message, account.publicKey),
			signature: {
				r,
				s,
				v,
			},
		});

		expect(
			Buffer.from(
				publicKeyConvert(Buffer.from(recovered.slice(2), "hex"), true),
			)
				.toString("hex")
				.substring(2),
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
			)
				.toString("hex")
				.substring(2),
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

function getBIP322HashP2SHP2WPKH(message: string, publicKey: string) {
	const publicKeyBuffer = Buffer.from(publicKey, "hex");

	const p2wpkhResult = p2wpkh(publicKeyBuffer);

	const redeemScript = p2wpkhResult.script;

	const p2shResult = p2sh(p2wpkhResult);
	if (!p2shResult.script) {
		throw new Error("Failed to generate P2SH scriptPubKey");
	}
	const scriptPubKey = p2shResult.script;

	const toSpendTx = BIP322.buildToSpendTx(message, Buffer.from(scriptPubKey));
	const toSignTx = BIP322.buildToSignTx(
		toSpendTx.getId(),
		Buffer.from(scriptPubKey),
	);

	toSignTx.updateInput(0, { sighashType: 1 });

	const tx = Transaction.fromPSBT(toSignTx.toBuffer());

	const signingScript = OutScript.encode({
		type: "pkh",
		hash: redeemScript.slice(2),
	});

	return tx.preimageWitnessV0(0, signingScript, 1, 0n);
}
