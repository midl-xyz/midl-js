import type { Config } from "~/createConfig";
import axios from "axios";

export type GetRuneBalanceParams = {
	/**
	 * The address
	 */
	address: string;
	/**
	 * The rune ID
	 */
	runeId: string;
};

export type GetRuneBalanceResponse = {
	/**
	 * The address
	 */
	address?: string;
	/**
	 * The balance of the rune
	 */
	balance: string;
};

/**
 * Gets the balance of a rune for an address
 *
 * @example
 * ```ts
 * const balance = await getRuneBalance(config, {
 *  address: "bc1q...",
 *  runeId: "1:1"
 * });
 * console.log(balance);
 * ```
 *
 * @param config The configuration object
 * @param params The parameters for the request
 * @returns The balance of the rune for the address
 */
export const getRuneBalance = async (
	config: Config,
	{ address, runeId }: GetRuneBalanceParams,
) => {
	if (!config.network) {
		throw new Error("No network found");
	}

	const response = await axios.get<GetRuneBalanceResponse>(
		`${config.network.runesUrl}/runes/v1/etchings/${runeId}/holders/${address}`,
	);

	return response.data;
};
