import {
	type BitcoinNetwork,
	regtest,
	testnet,
	testnet4,
} from "@midl-xyz/midl-js-core";
import { midlRegtest, midlTestnet3, midlTestnet4 } from "~/config/chains";

export const getEVMFromBitcoinNetwork = (network: BitcoinNetwork) => {
	switch (network.id) {
		case regtest.id: {
			return midlRegtest;
		}

		case testnet4.id: {
			return midlTestnet4;
		}

		case testnet.id: {
			return midlTestnet3;
		}

		default: {
			throw new Error(`Unsupported network: ${network.id}`);
		}
	}
};
