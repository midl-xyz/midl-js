import type { BitcoinNetwork } from "~/createConfig";

export const regtest = {
	id: "regtest",
	network: "regtest",
	explorerUrl: "https://mempool.regtest.midl.xyz",
} satisfies BitcoinNetwork;
