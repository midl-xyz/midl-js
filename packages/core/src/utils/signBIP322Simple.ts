// import * as ecc from "@bitcoinerlab/secp256k1";
// import * as bitcoin from "bitcoinjs-lib";
// import ECPairFactory, { type ECPairInterface } from "ecpair";
// import { encode } from "varuint-bitcoin";
// import { hexToBytes, sha256, toBytes } from "viem";
// import { extractXCoordinate } from "~/utils";
// import { signBip322MessageSimple } from "@leather.io/bitcoin";
// import * as btc from "@scure/btc-signer";

// const ECPair = ECPairFactory(ecc);

// type SignBip322SimpleParams = {
// 	message: string;
// 	privateKey: string;
// 	address: string;
// 	network: bitcoin.Network;
// };

// export const bip322TransactionToSignValues = {
// 	prevoutHash: Buffer.from(
// 		"0000000000000000000000000000000000000000000000000000000000000000",
// 		"hex",
// 	),

// 	prevoutIndex: 0xffffffff,
// 	sequence: 0,
// };

// function hashBIP0322Message(message: string) {
// 	const bip322MessageTag = "BIP0322-signed-message";

// 	const messageTagHash = Uint8Array.from([
// 		...Buffer.from(sha256(toBytes(bip322MessageTag)), "hex"),
// 		...Buffer.from(sha256(toBytes(bip322MessageTag)), "hex"),
// 	]);

// 	return sha256(Uint8Array.from([...messageTagHash, ...toBytes(message)]));
// }

// const buildToSignPsbt = (
// 	script: Uint8Array,
// 	txToSpend: Uint8Array,
// 	network: bitcoin.Network,
// ) => {
// 	const virtualToSign = new bitcoin.Psbt({
// 		network,
// 	});
// 	virtualToSign.setVersion(0);
// 	const prevTxHash = txToSpend;
// 	const prevOutIndex = 0;
// 	const toSignScriptSig = bitcoin.script.compile([
// 		bitcoin.script.OPS.OP_RETURN,
// 	]);

// 	virtualToSign.addInput({
// 		hash: prevTxHash,
// 		index: prevOutIndex,
// 		sequence: 0,
// 		witnessUtxo: { script, value: 0n },
// 	});

// 	virtualToSign.addOutput({ script: toSignScriptSig, value: 0n });

// 	return virtualToSign;
// };

// const buildToSpendTx = (
// 	address: string,
// 	message: string,
// 	network: bitcoin.Network,
// ) => {
// 	const { prevoutHash, prevoutIndex, sequence } = bip322TransactionToSignValues;

// 	const script = bitcoin.address.toOutputScript(address, network);

// 	const hash = hashBIP0322Message(message);
// 	const commands = [0, Buffer.from(hash)];
// 	const scriptSig = bitcoin.script.compile(commands);

// 	const virtualToSpend = new bitcoin.Transaction();
// 	virtualToSpend.version = 0;
// 	virtualToSpend.addInput(
// 		Buffer.from(prevoutHash),
// 		prevoutIndex,
// 		sequence,
// 		scriptSig,
// 	);
// 	virtualToSpend.addOutput(script, 0n);

// 	return { virtualToSpend, script };
// };

// export const signBip322Simple = async ({
// 	privateKey,
// 	message,
// 	address,
// 	network,
// }: SignBip322SimpleParams) => {
// 	const keyPair = ECPair.fromWIF(privateKey, network);

// 	const internalPubKey = Buffer.from(
// 		extractXCoordinate(keyPair.publicKey.toString("hex")),
// 		"hex",
// 	);

// 	// const { signature } = await signBip322MessageSimple({
// 	// 	message,
// 	// 	network: "regtest",
// 	// 	address,
// 	// 	signPsbt: async (psbt) => {
// 	// 		psbt.data.inputs[0].tapInternalKey = internalPubKey;

// 	// 		const tweaked = keyPair.tweak(
// 	// 			bitcoin.crypto.taggedHash("TapTweak", internalPubKey) as Buffer,
// 	// 		);

// 	// 		const tx = btc.Transaction.fromPSBT(psbt.toBuffer());

// 	// 		tx.signIdx(tweaked.privateKey, 0);

// 	// 		return tx;
// 	// 	},
// 	// });

// 	// return signature;

// 	const { virtualToSpend, script } = buildToSpendTx(address, message, network);
// 	const psbt = buildToSignPsbt(script, virtualToSpend.getHash(), network);

// 	psbt.updateInput(0, {
// 		tapInternalKey: internalPubKey,
// 	});

// 	const tweaked = keyPair.tweak(
// 		bitcoin.crypto.taggedHash("TapTweak", internalPubKey) as Buffer,
// 	);

// 	psbt.signAllInputs(tweaked, [bitcoin.Transaction.SIGHASH_DEFAULT]);

// 	const asBitcoinJsTransaction = bitcoin.Psbt.fromBuffer(psbt.toBuffer());
// 	asBitcoinJsTransaction.finalizeInput(0);
// 	const toSignTx = asBitcoinJsTransaction.extractTransaction();
// 	const result = encodeMessageWitnessData(toSignTx.ins[0].witness);
// 	return result.toString("base64");
// };

// function encodeVarString(b: Buffer) {
// 	return Buffer.concat([encode(b.byteLength), b]);
// }

// export function encodeMessageWitnessData(witnessArray: Buffer[]) {
// 	const len = encode(witnessArray.length);
// 	return Buffer.concat([
// 		len,
// 		...witnessArray.map((witness) => encodeVarString(witness)),
// 	]);
// }
