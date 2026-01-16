import { mainnet, regtest, signet, testnet, testnet4 } from "@midl/core";
import type { MidlNetworkConfig } from "~/type-extensions";

export const getBitcoinNetwork = (userConfig: MidlNetworkConfig) => {
	const networks = { regtest, mainnet, testnet4, testnet, signet } as const;

	const { network } = userConfig;

	if (typeof network === "string") {
		if (!(network in networks)) {
			throw new Error(`Network ${network} is not supported`);
		}

		return networks[network as keyof typeof networks];
	}

	return network ?? mainnet;
};
