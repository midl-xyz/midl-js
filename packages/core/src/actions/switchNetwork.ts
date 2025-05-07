import type { BitcoinNetwork, Config } from "~/createConfig";

// TODO: rename Wrong Usage error
class CommonError extends Error {}

// TODO: misleading error
export class NetworkError extends CommonError {}

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
		throw new NetworkError();
	}

	config.setState({
		network,
	});
};
