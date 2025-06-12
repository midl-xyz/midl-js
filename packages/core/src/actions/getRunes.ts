import type { Config } from "~/createConfig";

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
	const { network, provider } = config.getState();

	return provider.getRunes(network, address, {
		limit,
		offset,
	});
};
