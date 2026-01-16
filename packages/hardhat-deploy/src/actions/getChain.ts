import {
	type Chain,
	SystemContracts,
	getEVMFromBitcoinNetwork,
} from "@midl/executor";
import type {
	HardhatRuntimeEnvironment,
	HttpNetworkConfig,
} from "hardhat/types";
import { getBitcoinNetwork } from "~/actions/getBitcoinNetwork";
import type { MidlNetworkConfig } from "~/type-extensions";

export const getChain = (
	userConfig: MidlNetworkConfig,
	hre: HardhatRuntimeEnvironment,
): Chain => {
	const { hardhatNetwork } = userConfig;
	const bitcoinNetwork = getBitcoinNetwork(userConfig);

	if (hardhatNetwork) {
		const { chainId, url } = hre.config.networks[
			hardhatNetwork
		] as HttpNetworkConfig;

		if (!chainId) {
			throw new Error(
				`Hardhat network ${hardhatNetwork} does not have chainId defined`,
			);
		}

		if (!url) {
			throw new Error(
				`Hardhat network ${hardhatNetwork} does not have url defined`,
			);
		}

		return {
			id: chainId,
			name: "MIDL",
			nativeCurrency: {
				name: "Bitcoin",
				symbol: "BTC",
				decimals: 18,
			},
			rpcUrls: {
				default: {
					http: [url],
				},
			},
			contracts: {
				multicall3: {
					address: SystemContracts.Multicall3,
				},
			},
		};
	}

	return getEVMFromBitcoinNetwork(bitcoinNetwork);
};
