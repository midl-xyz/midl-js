import type { BitcoinNetwork } from "~/createConfig.js";

export const signet = {
	id: "signet",
	network: "testnet",
	explorerUrl: "https://mempool.signet.midl.xyz",
} satisfies BitcoinNetwork;
