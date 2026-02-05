import type { BitcoinNetwork } from "~/createConfig.js";

// TODO: Update types for supply and mint_terms fields.
export type RuneResponse = {
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
	number?: number;
	/**
	 * The rune divisibility
	 */
	divisibility: number;
	/**
	 * The rune symbol
	 */
	symbol: string;

	mint_terms?: {
		amount: bigint | null;
		cap: bigint | null;
		height_start: number | null;
		height_end: number | null;
		offset_start: number | null;
		offset_end: number | null;
	};
	supply?: {
		current?: bigint;
		minted?: bigint;
		total_mints?: string;
		mint_percentage?: string;
		mintable?: boolean;
		burned?: string;
		total_burns?: string;
		premine: bigint;
	};
	location?: {
		block_hash?: string;
		block_height: number;
		tx_id: string;
		tx_index?: number;
		timestamp?: number;
	};
};

export type RuneBalanceResponse = {
	/**
	 * The address
	 */
	address?: string;
	/**
	 * The balance of the rune
	 */
	balance: bigint;
};

export type RunesResponse = {
	/**
	 * The limit of runes
	 */
	limit: number;
	/**
	 * The offset of runes
	 */
	offset: number;
	/**
	 * The total number of runes
	 */
	total: number;
	/**
	 * The results
	 */
	results: {
		/**
		 * The rune details
		 * */
		rune: {
			id: string;
			number?: number;
			name: string;
			spaced_name: string;
		};
		/**
		 * The balance of the rune
		 */
		balance: bigint;
		/**
		 * The address
		 */
		address: string;
	}[];
};

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
	 * The runes in the UTXO
	 */
	runes: {
		// rune: string;
		runeid: string;
		// spacedRune: string;
		amount: bigint;
		// symbol: string;
		// divisibility: number;
	}[];
};

export interface AbstractRunesProvider {
	getRune(network: BitcoinNetwork, runeId: string): Promise<RuneResponse>;

	getRuneBalance(
		network: BitcoinNetwork,
		address: string,
		runeId: string,
	): Promise<RuneBalanceResponse>;

	getRunes(
		network: BitcoinNetwork,
		address: string,
		params?: {
			limit?: number;
			offset?: number;
		},
	): Promise<RunesResponse>;

	getRuneUTXOs(
		network: BitcoinNetwork,
		address: string,
		runeId: string,
	): Promise<RuneUTXO[]>;
}
