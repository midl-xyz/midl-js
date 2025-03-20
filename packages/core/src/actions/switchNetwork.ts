import type { BitcoinNetwork, Config } from "~/createConfig";

/**
 * Switches the network to the given network
 *
 * @example
 * ```ts
 * import { mainnet } from "@midl-xyz/midl-js-core";
 *
 * await switchNetwork(config, mainnet);
 * ```
 *
 * @param config The configuration object
 * @param network The network to switch to
 */
export const switchNetwork = async (
	config: Config,
	network: BitcoinNetwork,
) => {
	const { networks } = config.getState();
	if (!networks.includes(network)) {
		throw new Error(`Network ${network} is not supported`);
	}

	config.setState({
		network,
	});
};
