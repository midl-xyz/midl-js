import ecc from "@bitcoinerlab/secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import type { Network } from "bitcoinjs-lib";
import { ECPairFactory } from "ecpair";

const ECPair = ECPairFactory(ecc);

export const getKeyPair = (network: Network = bitcoin.networks.regtest) =>
	ECPair.fromPrivateKey(
		Buffer.from(
			"d6253db0047fcd99323946c6c535d227279881c5329d1de5006247a3689a6b11",
			"hex",
		),
		{ network },
	);

export const __TEST__MNEMONIC__ =
	"test test test test test test test test test test test junk";
