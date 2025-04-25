import { midlRegtest } from "@midl-xyz/midl-js-executor";
import { mock } from "@wagmi/connectors";
import type { Chain } from "viem";
import { http, createConfig } from "wagmi";

export const wagmiConfig = createConfig({
	chains: [midlRegtest as Chain],
	transports: {
		[midlRegtest.id]: http(midlRegtest.rpcUrls.default.http[0]),
	},
	connectors: [
		mock({
			accounts: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
		}),
	],
});
