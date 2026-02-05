import type { Config } from "~/createConfig.js";

/**
 * Gets the recommended fee rate
 *
 * @example
 * ```ts
 * const feeRate = await getFeeRate(config);
 * console.log(feeRate);
 * ```
 *
 * @param config  The configuration object
 * @returns The recommended fee rate object
 */
export const getFeeRate = async (config: Config) => {
	const { network, provider } = config.getState();

	if (!network) {
		throw new Error("No network");
	}

	return provider.getFeeRate(network);
};
