import type { Chain } from "~/types/chain";

export const devnet: Chain = {
	id: 0x309,
	rpcUrls: {
		default: {
			http: ["http://52.30.195.20:8545"],
		},
	},
	name: "midl",
	nativeCurrency: {
		name: "MIDL",
		symbol: "MIDL",
		decimals: 18,
	},
};
