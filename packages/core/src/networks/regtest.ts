import type { BitcoinNetwork } from "~/createConfig";

export const regtest: BitcoinNetwork = {
	id: "regtest",
	network: "regtest",
	explorerUrl: "https://mempool.regtest.midl.xyz",
};
