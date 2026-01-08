import { SystemContracts } from "~/config/addresses";
import type { Chain } from "~/config/chains/chain";

export const midlRegtest: Chain = {
	id: 0x3a99,
	rpcUrls: {
		default: {
			http: ["https://rpc.regtest.midl.xyz"],
		},
	},
	name: "midl-regtest",
	nativeCurrency: {
		name: "MIDL",
		symbol: "MIDL",
		decimals: 18,
	},
	contracts: {
		multicall3: {
			address: SystemContracts.Multicall3,
		},
	},
};
