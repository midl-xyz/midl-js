import { midlRegtest } from "@midl-xyz/midl-js-executor";
import type { Chain } from "viem";
import { createConfig, http } from "wagmi";

export const wagmiConfig = createConfig({
	chains: [
		{
			...midlRegtest,
			rpcUrls: {
				default: {
					http: [midlRegtest.rpcUrls.default.http[0]],
				},
			},
		} as Chain,
	],
	transports: {
		[midlRegtest.id]: http(midlRegtest.rpcUrls.default.http[0]),
	},
});
