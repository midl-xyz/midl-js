// import * as bitcoin from "bitcoinjs-lib";
// import ECPairFactory from "ecpair";
// import * as ecc from "@bitcoinerlab/secp256k1";
// import { stringToBytes } from "viem";
// import { getAddressType } from "~/utils/getAddressType";
// import { AddressType } from "~/constants";
// import { extractXCoordinate } from "~/utils/extractXCoordinate";
// import { encode } from "varuint-bitcoin";

// const ECPair = ECPairFactory(ecc);

// const hashBip322Message = (message: string) => {
// 	const tag = bitcoin.crypto.hash160(stringToBytes("BIP0322-signed-message"));
// 	const messageBytes = stringToBytes(message);

// 	return bitcoin.crypto.hash256(Buffer.concat([tag, tag, messageBytes]));
// };

// const createToSpendTx = (
// 	message: string,
// 	script: Uint8Array<ArrayBufferLike>,
// ) => {
// 	const messageHash = hashBip322Message(message);
// 	const scriptSig = bitcoin.script.compile([0, messageHash]);
// 	const virtualToSpend = new bitcoin.Transaction();

// 	virtualToSpend.version = 0;
// 	virtualToSpend.addInput(
// 		Buffer.from(
// 			"0000000000000000000000000000000000000000000000000000000000000000",
// 			"hex",
// 		),
// 		0xffffffff,
// 		0,
// 		scriptSig,
// 	);

// 	virtualToSpend.addOutput(script, 0n);

// 	return virtualToSpend;
// };

// const createToSignTx = (
// 	toSpendTxHash: Uint8Array<ArrayBufferLike>,
// 	script: Uint8Array<ArrayBufferLike>,
// 	network: bitcoin.Network,
// ) => {
// 	const virtualToSign = new bitcoin.Psbt({ network });

// 	virtualToSign.setVersion(0);

// 	virtualToSign.addInput({
// 		hash: toSpendTxHash,
// 		index: 0,
// 		sequence: 0,
// 		witnessUtxo: { script, value: 0n },
// 	});

// 	virtualToSign.addOutput({
// 		script: bitcoin.script.compile([bitcoin.script.OPS.OP_RETURN]),
// 		value: 0n,
// 	});

// 	return virtualToSign;
// };

// export const signBIP322 = async (
// 	message: string,
// 	address: string,
// 	privateKey: string,
// 	network: bitcoin.Network,
// ) => {
// 	const keyPair = ECPair.fromWIF(privateKey, network);
// 	const script = bitcoin.address.toOutputScript(address, network);

// 	const toSpendTx = createToSpendTx(message, script);
// 	const toSignTx = createToSignTx(toSpendTx.getHash(), script, network);

// 	switch (getAddressType(address)) {
// 		case AddressType.P2TR: {
// 			const internalPubKey = Buffer.from(
// 				extractXCoordinate(keyPair.publicKey.toString("hex")),
// 				"hex",
// 			);

// 			const signer = keyPair.tweak(
// 				Buffer.from(bitcoin.crypto.taggedHash("TapTweak", internalPubKey)),
// 			);

// 			toSignTx.updateInput(0, {
// 				tapInternalKey: internalPubKey,
// 			});
// 			toSignTx.signInput(0, signer);

// 			break;
// 		}

// 		default: {
// 			toSignTx.signInput(0, keyPair);
// 		}
// 	}

// 	const signedTx = toSignTx.finalizeAllInputs().extractTransaction();

// 	return encodeMessageWitnessData(signedTx.ins[0].witness).toString("base64");
// };

// export function encodeMessageWitnessData(
// 	witnessArray: Uint8Array<ArrayBufferLike>[],
// ) {
// 	const len = encode(witnessArray.length);
// 	return Buffer.concat([
// 		len,
// 		...witnessArray.map((witness) => encodeVarString(witness)),
// 	]);
// }

// function encodeVarString(b: Uint8Array<ArrayBufferLike>) {
// 	return Buffer.concat([encode(b.byteLength), b]);
// }
