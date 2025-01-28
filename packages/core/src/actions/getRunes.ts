import type { Config } from "~/createConfig";
import axios from "axios";

export type GetRunesParams = {
	/**
	 * The maximum number of runes to get
	 */
	limit?: number;
	/**
	 *  The offset to start getting runes from
	 */
	offset?: number;
	/**
	 * The address to get the runes of
	 */
	address: string;
};

export type GetRunesResponse = {
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
			number: number;
			name: string;
			spaced_name: string;
		};
		/**
		 * The balance of the rune
		 */
		balance: string;
		/**
		 * The address
		 */
		address: string;
	}[];
};

/**
 * Gets the runes for an address, with optional limit and offset
 * Limit defaults to 20, offset defaults to 0
 *
 * @example
 * ```ts
 * const runes = await getRunes(config, {
 * 	address: "bc1q..."
 * });
 *
 * console.log(runes);
 * ```
 *
 * @param config The configuration object
 * @param params The parameters for the request
 *
 * @returns The runes for the address
 */
export const getRunes = async (
	config: Config,
	{ address, limit = 20, offset = 0 }: GetRunesParams,
) => {
	if (!config.network) {
		throw new Error("No network found");
	}

	const response = await axios.get<GetRunesResponse>(
		`${config.network.runesUrl}/runes/v1/addresses/${address}/balances`,
		{
			params: {
				limit,
				offset,
			},
		},
	);

	return response.data;
};
