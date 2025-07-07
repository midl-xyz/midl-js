import ecc from "@bitcoinerlab/secp256k1";
import {
	KeyPairConnector,
	createConfig,
	keyPairConnector,
	regtest,
} from "@midl-xyz/midl-js-core";
import Bip32Factory from "bip32";
import bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import * as ecpair from "ecpair";

const bip32 = Bip32Factory(ecc);
const ECPair = ecpair.ECPairFactory(ecc);

import type { Network } from "bitcoinjs-lib";

const getKeyPair = (network: Network = bitcoin.networks.regtest) => {
	// biome-ignore lint/style/noNonNullAssertion: Private key is always defined
	const mnemonic = process.env.MNEMONIC!;
	const seed = bip39.mnemonicToSeedSync(mnemonic);
	const root = bip32.fromSeed(seed, network);
	const child = root.derivePath("m/86'/1'/0'/0/0");

	// biome-ignore lint/style/noNonNullAssertion: Private key is always defined
	return ECPair.fromWIF(child.toWIF()!, network);
};

export const midlConfig = createConfig({
	networks: [regtest],
	connectors: [keyPairConnector({ keyPair: getKeyPair() })],
});
