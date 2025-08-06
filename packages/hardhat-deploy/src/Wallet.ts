import * as ecc from "@bitcoinerlab/secp256k1";
import { AddressType, type BitcoinNetwork } from "@midl-xyz/midl-js-core";
import BIP32Factory, { type BIP32Interface } from "bip32";
import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";

const bip32 = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc);

bitcoin.initEccLib(ecc);

export const DerivationPath: Record<
	"Xverse" | "Leather",
	Record<
		AddressType,
		{
			mainnet: string;
			testnet: string;
		}
	>
> = {
	Xverse: {
		[AddressType.P2TR]: {
			mainnet: "m/86'/0'/ACCOUNT'/0/0",
			testnet: "m/86'/1'/ACCOUNT'/0/0",
		},
		[AddressType.P2WPKH]: {
			mainnet: "m/84'/0'/ACCOUNT'/0/0",
			testnet: "m/84'/1'/ACCOUNT'/0/0",
		},
		[AddressType.P2SH_P2WPKH]: {
			mainnet: "m/49'/0'/ACCOUNT'/0/0",
			testnet: "m/49'/1'/ACCOUNT'/0/0",
		},
	},
	Leather: {
		[AddressType.P2TR]: {
			mainnet: "m/86'/0'/ACCOUNT'/0/0",
			testnet: "m/86'/1'/ACCOUNT'/0/0",
		},
		[AddressType.P2WPKH]: {
			mainnet: "m/84'/0'/ACCOUNT'/0/0",
			testnet: "m/84'/1'/ACCOUNT'/0/0",
		},
		[AddressType.P2SH_P2WPKH]: {
			mainnet: "m/49'/0'/ACCOUNT'/0/0",
			testnet: "m/49'/1'/ACCOUNT'/0/0",
		},
	},
};

export class Wallet {
	private readonly network: bitcoin.Network;
	private readonly root: BIP32Interface;

	constructor(
		readonly mnemonic: string,
		bitcoinNetwork: BitcoinNetwork,
		private readonly derivationPath: string,
	) {
		if (!bip39.validateMnemonic(mnemonic)) {
			throw new Error("Invalid mnemonic");
		}

		this.network = bitcoin.networks[bitcoinNetwork.network];

		const seed = bip39.mnemonicToSeedSync(mnemonic);
		this.root = bip32.fromSeed(seed, this.network);
	}

	getAccount(index = 0) {
		const child = this.root.derivePath(
			this.derivationPath.replace("ACCOUNT", index.toString()),
		);
		return ECPair.fromWIF(child.toWIF(), this.network);
	}
}
