import { AddressType } from "~/constants";
import * as bitcoin from "bitcoinjs-lib";
import { sha256 } from "@noble/hashes/sha256";
import { getAddressType } from "~/utils/getAddressType";
import { extractXCoordinate } from "~/utils";
import { encode } from "varuint-bitcoin";
import ECPairFactory from "ecpair";
import * as ecc from "@bitcoinerlab/secp256k1";

function bip0322_hash(message: string) {
	const tag = "BIP0322-signed-message";
	const tagHash = sha256(Buffer.from(tag));
	const result = sha256(
		Buffer.concat([tagHash, tagHash, Buffer.from(message)]),
	);
	return result;
}
export const signBIP322Simple = (
	message: string,
	privateKey: string,
	address: string,
	network: bitcoin.networks.Network,
) => {
	const ECPair = ECPairFactory(ecc);

	const keyPair = ECPair.fromWIF(privateKey, network);
	const outputScript = bitcoin.address.toOutputScript(address, network);
	const prevoutHash = Buffer.from(
		"0000000000000000000000000000000000000000000000000000000000000000",
		"hex",
	);
	const prevoutIndex = 0xffffffff;
	const sequence = 0;
	const scriptSig = Buffer.concat([
		Buffer.from("0020", "hex"),
		bip0322_hash(message),
	]);

	const txToSpend = new bitcoin.Transaction();
	txToSpend.version = 0;
	txToSpend.addInput(prevoutHash, prevoutIndex, sequence, scriptSig);
	txToSpend.addOutput(outputScript, 0n);

	const psbtToSign = new bitcoin.Psbt();

	psbtToSign.setVersion(0);
	psbtToSign.addInput({
		hash: txToSpend.getHash(),
		index: 0,
		sequence: 0,
		witnessUtxo: {
			script: outputScript,
			value: 0n,
		},
	});

	psbtToSign.addOutput({ script: Buffer.from("6a", "hex"), value: 0n });

	switch (getAddressType(address)) {
		case AddressType.P2TR: {
			const internalPubKey = Buffer.from(
				extractXCoordinate(keyPair.publicKey.toString("hex")),
				"hex",
			);

			const signer = keyPair.tweak(
				Buffer.from(bitcoin.crypto.taggedHash("TapTweak", internalPubKey)),
			);

			psbtToSign.updateInput(0, {
				tapInternalKey: internalPubKey,
			});

			psbtToSign.signInput(0, signer);

			break;
		}

		case AddressType.P2WPKH: {
			psbtToSign.signInput(0, keyPair);
			break;
		}

		default: {
			psbtToSign.signInput(0, keyPair);
		}
	}

	const signedTx = psbtToSign.finalizeAllInputs().extractTransaction();

	return encodeMessageWitnessData(signedTx.ins[0].witness).toString("base64");
};

export function encodeMessageWitnessData(witnessArray: Uint8Array[]) {
	const len = encode(witnessArray.length);
	return Buffer.concat([
		len,
		...witnessArray.map((witness) => encodeVarString(witness)),
	]);
}

function encodeVarString(b: Uint8Array) {
	return Buffer.concat([encode(b.byteLength), b]);
}
