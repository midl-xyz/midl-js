import type { Config } from "~/createConfig";

export type RuneUTXO = {
	/**
	 * The height of the UTXO
	 */
	height: number;
	/**
	 * The address of the UTXO
	 */
	address: string;
	/**
	 * The txid of the UTXO
	 */
	txid: string;
	/**
	 * The vout of the UTXO
	 */
	vout: number;
	/**
	 * The amount of satoshis
	 */
	satoshis: number;
	/**
	 * The scriptPubKey
	 */
	scriptPk: string;
	/**
	 * The runes in the UTXO
	 */
	runes: {
		rune: string;
		runeid: string;
		spacedRune: string;
		amount: string;
		symbol: string;
		divisibility: number;
	}[];
};

/**
 * Retrieves the UTXOs associated with a specific rune for a given address.
 * This is useful for obtaining the necessary UTXOs to create a PSBT for that rune.
 *
 * @example
 * ```ts
 * const utxos = await getRuneUTXO(config, "bc1q...", "1:1");
 * console.log(utxos);
 * ```
 *
 * @param config The configuration object
 * @param address The address to get the UTXOs of
 * @param runeId The rune ID to get the UTXOs of
 * @returns The UTXOs for the rune for the address
 */
export const getRuneUTXO = async (
	config: Config,
	address: string,
	runeId: string,
) => {
	const { network, provider } = config.getState();

	if (!network) {
		throw new Error("No network");
	}

	return provider.getRuneUTXOs(network, address, runeId);
};
