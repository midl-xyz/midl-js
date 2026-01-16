import { SystemContracts } from "~/config/addresses";
import type { Chain } from "~/config/chains/chain";

export const midl: Chain = {
	id: 0x5dc,
	rpcUrls: {
		default: {
			http: ["https://rpc.midl.xyz"],
		},
	},
	name: "MIDL",
	nativeCurrency: {
		name: "Bitcoin",
		symbol: "BTC",
		decimals: 18,
	},
	contracts: {
		multicall3: {
			address: SystemContracts.Multicall3,
		},
	},
};
