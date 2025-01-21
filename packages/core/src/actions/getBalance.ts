import { getUTXOs } from "~/actions/getUTXOs";
import type { Config } from "~/createConfig";

/**
 * Gets the balance of an address accumulated from UTXOs
 *
 * @example
 * ```ts
 * import { getBalance } from "@midl-xyz/midl-js-core";
 *
 * const balance = await getBalance(config, "bc1q...");
 * console.log(balance);
 * ```
 *
 * @param config The configuration object
 * @param address The address to get the balance of
 * @returns The balance in satoshis
 */
export const getBalance = async (config: Config, address: string) => {
	if (!config.network) {
		throw new Error("No network");
	}

	const utxos = await getUTXOs(config, address);

	return utxos.reduce((acc, utxo) => acc + utxo.value, 0);
};
