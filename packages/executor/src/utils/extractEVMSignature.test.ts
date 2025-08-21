import {
	AddressPurpose,
	SignMessageProtocol,
	connect,
	disconnect,
	getDefaultAccount,
	signMessage,
} from "@midl/core";
import { schnorr } from "@noble/secp256k1";
import { Verifier } from "bip322-js";
import { magicHash } from "bitcoinjs-message";
import { publicKeyConvert } from "secp256k1";
import {
	getAddress,
	hexToBigInt,
	keccak256,
	recoverAddress,
	recoverPublicKey,
} from "viem";
import { afterEach, describe, expect, it } from "vitest";
import { midlConfig, midlConfigP2SH } from "~/__tests__/midlConfig";
import { getPublicKey } from "~/actions";
import { extractEVMSignature } from "~/utils/extractEVMSignature";
import { getBIP322Hash } from "~/utils/getBIP322Hash";
import { getEVMAddress } from "~/utils/getEVMAddress";

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

		const { r, s, v } = await extractEVMSignature(
			message,
			signature,
			protocol,
			account,
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

		const account = getDefaultAccount(midlConfigP2SH);
		const pk = getPublicKey(account, midlConfigP2SH.getState().network);

		if (!pk) {
			throw new Error("No public key found for account");
		}

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

		const { r, s, v } = await extractEVMSignature(
			message,
			signature,
			protocol,
			account,
		);

		const recovered = await recoverPublicKey({
			hash: getBIP322Hash(message, account.addressType, account.publicKey),
			signature: {
				r,
				s,
				v,
			},
		});

		expect(isValid).toBeTruthy();
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

		const account = getDefaultAccount(midlConfig);

		const message = keccak256(new TextEncoder().encode("test"));

		const { signature, protocol } = await signMessage(midlConfig, {
			protocol: SignMessageProtocol.Ecdsa,
			message: message,
			address: account.address,
		});

		const { r, s, v } = await extractEVMSignature(
			message,
			signature,
			protocol,
			account,
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

		const account = getDefaultAccount(midlConfig);

		const message = keccak256(new TextEncoder().encode("test"));

		const { signature, protocol } = await signMessage(midlConfig, {
			protocol: SignMessageProtocol.Bip322,
			message: message,
			address: account.address,
		});

		const network = midlConfig.getState().network;

		const pk = getPublicKey(account, network);

		if (!pk) {
			throw new Error("No public key found for account");
		}

		const { r, s, v } = await extractEVMSignature(
			message,
			signature,
			protocol,
			account,
		);

		const recovered = await recoverPublicKey({
			hash: getBIP322Hash(message, account.addressType, account.publicKey),
			signature: {
				r,
				s,
				v,
			},
		});

		const hashedMessage = getBIP322Hash(
			message,
			account.addressType,
			account.publicKey,
		);

		const recoveredAddress = await recoverAddress({
			hash: hashedMessage,
			signature: { r, s, v },
		});

		const hash = getEVMAddress(account, network);

		expect(hash).toEqual(recoveredAddress);

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

		const pk = getPublicKey(account, midlConfig.getState().network);

		if (!pk) {
			throw new Error("No public key found for account");
		}

		const { r, s } = await extractEVMSignature(
			message,
			signature,
			protocol,
			account,
		);

		const valid = await schnorr.verify(
			new schnorr.Signature(hexToBigInt(r), hexToBigInt(s)).toHex(),
			getBIP322Hash(message, account.addressType, pk.substring(2)),
			Buffer.from(pk.substring(2), "hex"),
		);

		expect(valid).toBeTruthy();
	});
});
