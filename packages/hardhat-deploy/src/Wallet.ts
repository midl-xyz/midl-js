import * as ecc from "@bitcoinerlab/secp256k1";
import {
	type BitcoinNetwork,
	type Config,
	extractXCoordinate,
} from "@midl-xyz/midl-js-core";
import { getEVMAddress } from "@midl-xyz/midl-js-executor";
import BIP32Factory, { type BIP32Interface } from "bip32";
import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import { toHex } from "viem";

const bip32 = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc);

bitcoin.initEccLib(ecc);

export class Wallet {
	private readonly network: bitcoin.Network;
	private readonly root: BIP32Interface;

	constructor(
		readonly mnemonic: string,
		bitcoinNetwork: BitcoinNetwork,
		private readonly derivationPath: string = "m/86'/1'/0'/0",
	) {
		if (!bip39.validateMnemonic(mnemonic)) {
			throw new Error("Invalid mnemonic");
		}

		this.network = bitcoin.networks[bitcoinNetwork.network];

		const seed = bip39.mnemonicToSeedSync(mnemonic);
		this.root = bip32.fromSeed(seed, this.network);
	}

	getAccount(index = 0) {
		const child = this.root.derivePath(`${this.derivationPath}/${index}`);
		return ECPair.fromWIF(child.toWIF(), this.network);
	}
}
