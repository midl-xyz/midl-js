import {
	type BitcoinNetwork,
	regtest,
	signet,
	testnet,
	testnet4,
} from "@midl/core";
import {
	midlRegtest,
	midlSignet,
	midlTestnet3,
	midlTestnet4,
} from "~/config/chains";

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

		case signet.id: {
			return midlSignet;
		}

		default: {
			throw new Error(`Unsupported network: ${network.id}`);
		}
	}
};
