import ecc from "@bitcoinerlab/secp256k1";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import * as bitcoin from "bitcoinjs-lib";
import { ECPairFactory } from "ecpair";
import { extractXCoordinate } from "~/utils";

bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);

export const makeRandomAddress = (network = bitcoin.networks.regtest) => {
	const keyPair = ECPair.makeRandom();

	const p2tr = bitcoin.payments.p2tr({
		pubkey: hexToBytes(extractXCoordinate(bytesToHex(keyPair.publicKey))),
		network,
	});

	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	return p2tr.address!;
};
