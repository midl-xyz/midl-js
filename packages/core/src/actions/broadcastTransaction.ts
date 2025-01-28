import axios from "axios";
import type { Config } from "~/createConfig";

/**
 * Broadcasts a transaction to the bitcoin network
 *
 * @example
 * ```ts
 * const txHex = "02000000000101...";
 * const txHash = await broadcastTransaction(config, txHex);
 * console.log(txHash);
 * ```
 *
 * @param config The configuration object
 * @param txHex The transaction hex
 * @returns The transaction hash
 */
export const broadcastTransaction = async (
	config: Config,
	txHex: string,
): Promise<string> => {
	if (!config.network) {
		throw new Error("No network");
	}

	const { data } = await axios.post<string>(
		`${config.network.rpcUrl}/tx`,
		txHex,
	);

	return data;
};
