import type { Config } from "~/createConfig";
import type { UTXO } from "~/providers";

const RUNE_MAGIC_VALUE = 546;

/**
 * Gets the UTXOs for an address, optionally including UTXOs with Runes
 *
 * @example
 * ```ts
 * const utxos = await getUTXOs(config, "bc1q...");
 * console.log(utxos);
 * ```
 *
 * @param config The configuration object
 * @param address The address to get the UTXOs of
 * @param includeRunes If true, include UTXOs with Runes
 * @returns The UTXOs for the address
 */
export const getUTXOs = async (
	config: Config,
	address: string,
	includeRunes = false,
): Promise<UTXO[]> => {
	const { network, provider } = config.getState();

	if (!network) {
		throw new Error("No network");
	}

	const utxos = await provider.getUTXOs(network, address);

	if (!includeRunes) {
		return utxos.filter((utxo) => utxo.value !== RUNE_MAGIC_VALUE);
	}

	return utxos;
};
