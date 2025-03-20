import type { Config } from "~/createConfig";
import axios from "axios";

export type UTXO = {
	/**
	 * The transaction ID of the UTXO
	 */
	readonly txid: string;
	/**
	 * The output index of the UTXO
	 */
	readonly vout: number;
	/**
	 * The value of the UTXO
	 */
	readonly value: number;
	/**
	 * The status of the UTXO
	 */
	readonly status: {
		/**
		 * Whether the UTXO is confirmed
		 */
		readonly confirmed: boolean;
		/**
		 * The block height of the UTXO
		 */
		readonly block_height: number;
		/**
		 * The block hash of the UTXO
		 */
		readonly block_hash: string;
		/**
		 * The block time of the UTXO
		 */
		readonly block_time: number;
	};
};

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
	const { network } = config.getState();

	if (!network) {
		throw new Error("No network");
	}

	const { data: utxos } = await axios.get<UTXO[]>(
		`${network.rpcUrl}/address/${address}/utxo`,
	);

	if (!includeRunes) {
		return utxos.filter((utxo) => utxo.value !== RUNE_MAGIC_VALUE);
	}

	return utxos;
};
