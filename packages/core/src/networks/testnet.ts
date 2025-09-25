import type { BitcoinNetwork } from "~/createConfig";

export const testnet = {
	id: "testnet",
	network: "testnet",
	explorerUrl: "https://mempool.space/testnet",
} satisfies BitcoinNetwork;
