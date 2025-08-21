import deployment from "@midl/contracts/deployments/0.1.1/Multicall3.json";
import type { Chain } from "~/config/chains/chain";

export const midlRegtest: Chain = {
	id: 0x309,
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
			address: deployment.address as `0x${string}`,
		},
	},
};
