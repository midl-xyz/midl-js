import { devnet } from "@midl-xyz/midl-js-core";
import { WagmiMidlProvider } from "@midl-xyz/midl-js-executor";
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, WagmiProvider, createConfig as createWagmiConfig } from "wagmi";
import type { Chain } from "wagmi/chains";
import { Connect } from "./connect/Connect";
import { EdictRune } from "./edict/EdictRune";
import midlConfig from "./midl.config";
import { AddLiquidity } from "./add-liquidity/AddLiquidity";
import { Swap } from "./swap/Swap";

export default function App() {
	const queryClient = new QueryClient();

	return (
		<MidlProvider config={midlConfig}>
			<QueryClientProvider client={queryClient}>
				<WagmiProvider
					config={createWagmiConfig({
						chains: [devnet as Chain],
						transports: {
							[devnet.id]: http(devnet.rpcUrls.default.http[0]),
						},
					})}
				>
					<WagmiMidlProvider />
					<Connect />
					<EdictRune />
					<AddLiquidity />
					<Swap />
				</WagmiProvider>
			</QueryClientProvider>
		</MidlProvider>
	);
}
