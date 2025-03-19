import type { Config } from "~/createConfig";
import axios from "axios";

export type GetRuneResponse = {
	/**
	 * The rune ID
	 */
	id: string;
	/**
	 * The rune name
	 */
	name: string;
	/**
	 * The rune spaced name
	 */
	spaced_name: string;
	/**
	 * The rune number
	 */
	number: number;
	/**
	 * The rune divisibility
	 */
	divisibility: number;
	/**
	 * The rune symbol
	 */
	symbol: string;
	turbo: boolean;
	mint_terms: {
		amount: number | null;
		cap: number | null;
		height_start: number | null;
		height_end: number | null;
		offset_start: number | null;
		offset_end: number | null;
	};
	supply: {
		current: string;
		minted: string;
		total_mints: string;
		mint_percentage: string;
		mintable: boolean;
		burned: string;
		total_burns: string;
		premine: string;
	};
	location: {
		block_hash: string;
		block_height: number;
		tx_id: string;
		tx_index: number;
		timestamp: number;
	};
};

/**
 * Gets a rune by its ID
 *
 * @example
 * ```ts
 * const rune = await getRune(config, "1:1");
 * console.log(rune);
 * ```
 *
 * @param config The configuration object
 * @param runeId The rune ID
 * @returns The rune object
 */
export const getRune = async (config: Config, runeId: string) => {
	const { network } = config.getState();

	if (!network) {
		throw new Error("No network found");
	}

	const response = await axios.get<GetRuneResponse>(
		`${network.runesUrl}/runes/v1/etchings/${runeId}`,
	);

	return response.data;
};
