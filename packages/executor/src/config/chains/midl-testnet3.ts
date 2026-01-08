import type { Chain } from "~/config/chains/chain";

export const midlTestnet3: Chain = {
	id: 0x3a99,
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
