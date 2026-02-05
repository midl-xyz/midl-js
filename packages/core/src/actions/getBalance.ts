import { getUTXOs } from "~/actions/getUTXOs.js";
import type { Config } from "~/createConfig.js";

/**
 * Gets the balance of an address accumulated from UTXOs
 *
 * @example
 * ```ts
 * const balance = await getBalance(config, "bc1q...");
 * console.log(balance);
 * ```
 *
 * @param config The configuration object
 * @param address The address to get the balance of
 * @returns The balance in satoshis
 */
export const getBalance = async (config: Config, address: string) => {
	const utxos = await getUTXOs(config, address);

	return utxos.reduce((acc, utxo) => acc + utxo.value, 0);
};
