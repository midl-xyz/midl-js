import {
	AddressPurpose,
	SignMessageProtocol,
	connect,
	getDefaultAccount,
	signMessage,
} from "@midl-xyz/midl-js-core";
import { schnorr } from "@noble/secp256k1";
import { Transaction } from "@scure/btc-signer";
import { BIP322 } from "bip322-js";
import { magicHash } from "bitcoinjs-message";
import { publicKeyConvert } from "secp256k1";
import { hexToBigInt, keccak256, recoverPublicKey } from "viem";
import { describe, expect, it } from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { getPublicKeyForAccount } from "~/actions";
import { extractEVMSignature } from "~/utils/extractEVMSignature";

describe("extractEVMSignature", () => {
	it("extracts evm signature using p2wpkh address", async () => {
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

		const { r, s, v } = extractEVMSignature(signature, protocol);

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

	it("extract evm signature using p2tr address", async () => {
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

		const { r, s } = extractEVMSignature(signature, protocol);

		const pk = await getPublicKeyForAccount(midlConfig);

		const valid = await schnorr.verify(
			new schnorr.Signature(hexToBigInt(r), hexToBigInt(s)).toHex(),
			getBIP322Hash(message, pk.substring(2)),
			Buffer.from(pk.substring(2), "hex"),
		);

		expect(valid).toBeTruthy();
	});
});

function getBIP322Hash(message: string, publicKey: string) {
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

	const keyHASH = tx.preimageWitnessV1(0, [scriptPubKey], 0, [0n]);

	return keyHASH;
}
