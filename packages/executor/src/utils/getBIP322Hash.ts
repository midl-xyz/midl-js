import { AddressType } from "@midl-xyz/midl-js-core";
import { OutScript, Transaction, p2sh, p2wpkh } from "@scure/btc-signer";
import { BIP322 } from "bip322-js";

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

export const getBIP322Hash = (
	message: string,
	addressType: AddressType,
	publicKey: string,
): Uint8Array => {
	switch (addressType) {
		case AddressType.P2TR:
			return getBIP322HashP2TR(message, publicKey);
		case AddressType.P2WPKH:
			return getBIP322HashP2WPKH(message, publicKey);
		case AddressType.P2SH:
			return getBIP322HashP2SHP2WPKH(message, publicKey);
		default:
			throw new Error(`Unsupported address type: ${addressType}`);
	}
};
