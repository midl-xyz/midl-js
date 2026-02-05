import type { BitcoinNetwork, Config } from "~/createConfig.js";

// TODO: rename Wrong Usage error
class CommonError extends Error {}

export class NetworkMismatchError extends CommonError {}

/**
 * Switches the network to the given network
 *
 * @example
 * ```ts
 * import { mainnet } from "@midl/core";
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
	const { networks, connection } = config.getState();

	if (!networks.includes(network)) {
		throw new NetworkMismatchError();
	}

	config.setState({
		network,
	});

	await connection?.switchNetwork?.(network);
};
