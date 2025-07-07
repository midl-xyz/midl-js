import ecc from "@bitcoinerlab/secp256k1";
import Bip32Factory from "bip32";
import bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import type { Network } from "bitcoinjs-lib";
import ECPairFactory from "ecpair";

const bip32 = Bip32Factory(ecc);

const ECPair = ECPairFactory(ecc);

export const getKeyPair = (network: Network = bitcoin.networks.regtest) => {
	const mnemonic =
		"face spike layer label health knee cry taste carpet found elegant october";
	const seed = bip39.mnemonicToSeedSync(mnemonic);
	const root = bip32.fromSeed(seed, network);
	const child = root.derivePath("m/86'/1'/0'/0/0");

	// biome-ignore lint/style/noNonNullAssertion: Private key is always defined
	return ECPair.fromWIF(child.toWIF()!, network);
};
