import type { Chain } from "~/config/chains/chain";

export const midlTestnet4: Chain = {
	id: 0x3a99,
	rpcUrls: {
		default: {
			http: [""],
		},
	},
	name: "midl-testnet4",
	nativeCurrency: {
		name: "Bitcoin",
		symbol: "BTC",
		decimals: 18,
	},
};
