import type { Config } from "~/createConfig";

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
	const { network, provider } = config.getState();

	return provider.getRuneBalance(network, address, runeId);
};
