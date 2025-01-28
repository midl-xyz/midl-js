import type { Config } from "~/createConfig";
import axios from "axios";

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
	if (!config.network) {
		throw new Error("No network");
	}

	const response = await axios.get<string>(
		`${config.network.rpcUrl}/blocks/tip/height`,
	);

	return Number.parseInt(response.data, 10);
};
