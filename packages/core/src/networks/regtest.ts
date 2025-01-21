import type { BitcoinNetwork } from "~/createConfig";

export const regtest: BitcoinNetwork = {
	id: "regtest",
	network: "regtest",
	rpcUrl: "https://mempool.regtest.midl.xyz/api",
	runesUrl: "https://mempool.regtest.midl.xyz",
	explorerUrl: "https://mempool.regtest.midl.xyz",
	runesUTXOUrl: "https://mempool.regtest.midl.xyz",
};
