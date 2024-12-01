import type { Chain } from "~/config/chains/chain";

export const midlRegtest: Chain = {
	id: 0x309,
	rpcUrls: {
		default: {
			http: ["https://evm-rpc.regtest.midl.xyz"],
		},
	},
	name: "midl-regtest",
	nativeCurrency: {
		name: "MIDL",
		symbol: "MIDL",
		decimals: 18,
	},
};
