import { AddressType, type BitcoinNetwork } from "@midl/core";

type DerivationPath = Record<
	BitcoinNetwork["network"],
	Record<AddressType, string>
>;

export const derivationPathMap: DerivationPath = {
	bitcoin: {
		[AddressType.P2WPKH]: "m/84'/0'/ACCOUNT'/0/0",
		[AddressType.P2SH_P2WPKH]: "m/49'/0'/ACCOUNT'/0/0",
		[AddressType.P2TR]: "m/86'/0'/ACCOUNT'/0/0",
	},
	testnet: {
		[AddressType.P2WPKH]: "m/84'/1'/ACCOUNT'/0/0",
		[AddressType.P2SH_P2WPKH]: "m/49'/1'/ACCOUNT'/0/0",
		[AddressType.P2TR]: "m/86'/1'/ACCOUNT'/0/0",
	},
	regtest: {
		[AddressType.P2WPKH]: "m/84'/1'/ACCOUNT'/0/0",
		[AddressType.P2SH_P2WPKH]: "m/49'/1'/ACCOUNT'/0/0",
		[AddressType.P2TR]: "m/86'/1'/ACCOUNT'/0/0",
	},
};
