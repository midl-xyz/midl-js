import type { Config } from "~/createConfig.js";

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
	const { network, runesProvider } = config.getState();

	if (!network) {
		throw new Error("No network found");
	}

	return runesProvider.getRune(network, runeId);
};
