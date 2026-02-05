import type { BitcoinNetwork } from "~/createConfig.js";

export const regtest = {
	id: "regtest",
	network: "regtest",
	explorerUrl: "https://mempool.staging.midl.xyz",
} satisfies BitcoinNetwork;
