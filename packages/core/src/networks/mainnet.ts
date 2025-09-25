import type { BitcoinNetwork } from "~/createConfig";

export const mainnet = {
	id: "mainnet",
	network: "bitcoin",
	explorerUrl: "https://mempool.space",
} satisfies BitcoinNetwork;
