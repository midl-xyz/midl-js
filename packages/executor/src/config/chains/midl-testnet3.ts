import type { Chain } from "~/config/chains/chain";

export const midlTestnet3: Chain = {
	id: 0x3a99,
	rpcUrls: {
		default: {
			http: [""],
		},
	},
	name: "midl-testnet3",
	nativeCurrency: {
		name: "Bitcoin",
		symbol: "BTC",
		decimals: 18,
	},
};
