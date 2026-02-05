import type { BitcoinNetwork } from "~/createConfig.js";

export const mainnet = {
	id: "mainnet",
	network: "bitcoin",
	explorerUrl: "https://mempool.space",
} satisfies BitcoinNetwork;
