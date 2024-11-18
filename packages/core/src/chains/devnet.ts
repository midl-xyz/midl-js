import type { Chain } from "~/types/chain";

export const devnet: Chain = {
	id: 0x309,
	rpcUrls: {
		default: {
			http: ["http://54.75.35.100:8545"],
		},
	},
	name: "midl",
	nativeCurrency: {
		name: "MIDL",
		symbol: "MIDL",
		decimals: 18,
	},
};
