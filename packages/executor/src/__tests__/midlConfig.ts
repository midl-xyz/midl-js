import { AddressType, createConfig, regtest } from "@midl/core";
import { keyPairConnector } from "@midl/node";
import { __TEST__MNEMONIC__ } from "~/__tests__/keyPair";

export const midlConfig = createConfig({
	networks: [regtest],
	connectors: [
		keyPairConnector({
			mnemonic: __TEST__MNEMONIC__,
			paymentAddressType: AddressType.P2WPKH,
		}),
	],
});

export const midlConfigP2SH = createConfig({
	networks: [regtest],
	connectors: [
		keyPairConnector({
			mnemonic: __TEST__MNEMONIC__,
			paymentAddressType: AddressType.P2SH_P2WPKH,
		}),
	],
});
