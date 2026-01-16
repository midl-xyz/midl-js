import type { Chain } from "~/config/chains/chain";

export const midlTestnet4: Chain = {
	id: 0x3a99,
	rpcUrls: {
		default: {
			http: ["http://54.75.35.100:8545"],
		},
	},
	name: "midl-regtest",
	nativeCurrency: {
		name: "Bitcoin",
		symbol: "BTC",
		decimals: 18,
	},
};
