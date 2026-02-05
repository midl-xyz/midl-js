import type { BitcoinNetwork } from "~/createConfig.js";

export const testnet = {
	id: "testnet",
	network: "testnet",
	explorerUrl: "https://mempool.space/testnet",
} satisfies BitcoinNetwork;
