import type { Chain } from "~/config/chains/chain";

export const midlRegtest: Chain = {
	id: 0x309,
	rpcUrls: {
		default: {
			http: ["http://54.75.35.100:8545"],
		},
	},
	name: "midl-regtest",
	nativeCurrency: {
		name: "MIDL",
		symbol: "MIDL",
		decimals: 18,
	},
};
