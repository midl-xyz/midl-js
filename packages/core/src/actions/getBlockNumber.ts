import type { Config } from "~/createConfig";

/**
 * Gets the current block number
 *
 * @example
 * ```ts
 * const blockNumber = await getBlockNumber(config);
 * console.log(blockNumber);
 * ```
 *
 * @param config The configuration object
 * @returns The current block number
 * */
export const getBlockNumber = async (config: Config) => {
	const { network, provider } = config.getState();

	if (!network) {
		throw new Error("No network");
	}

	return provider.getLatestBlockHeight(network);
};
