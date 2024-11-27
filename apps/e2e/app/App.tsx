import { midlRegtest, WagmiMidlProvider } from "@midl-xyz/midl-js-executor";
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, WagmiProvider, createConfig as createWagmiConfig } from "wagmi";
import type { Chain } from "wagmi/chains";
import { Connect } from "./connect/Connect";
import { EdictRune } from "./edict/EdictRune";
import midlConfig from "./midl.config";
import { AddLiquidity } from "./add-liquidity/AddLiquidity";
import { Swap } from "./swap/Swap";
import { CompleteTx } from "./complete-tx/CompleteTx";

export default function App() {
	const queryClient = new QueryClient();

	return (
		<MidlProvider config={midlConfig}>
			<QueryClientProvider client={queryClient}>
				<WagmiProvider
					config={createWagmiConfig({
						chains: [midlRegtest as Chain],
						transports: {
							[midlRegtest.id]: http(midlRegtest.rpcUrls.default.http[0]),
						},
					})}
				>
					<WagmiMidlProvider />
					<Connect />
					<EdictRune />
					<AddLiquidity />
					<Swap />
					<CompleteTx />
				</WagmiProvider>
			</QueryClientProvider>
		</MidlProvider>
	);
}
