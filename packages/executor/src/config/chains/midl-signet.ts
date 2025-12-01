import { SystemContracts } from "~/config/addresses";
import type { Chain } from "~/config/chains/chain";

export const midlSignet: Chain = {
	id: 0x309,
	rpcUrls: {
		default: {
			http: ["https://rpc.signet.midl.xyz"],
		},
	},
	name: "midl-signet",
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
