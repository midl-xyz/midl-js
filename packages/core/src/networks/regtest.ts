import type { BitcoinNetwork } from "~/createConfig";

export const regtest: BitcoinNetwork = {
	id: "regtest",
	network: "regtest",
	rpcUrl: "https://regtest-mempool.midl.xyz/api",
	runesUrl: "https://regtest-mempool.midl.xyz",
	explorerUrl: "https://regtest-mempool.midl.xyz",
	runesUTXOUrl: "https://regtest-mempool.midl.xyz",
};
