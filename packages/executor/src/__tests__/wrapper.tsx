import { createConfig, satsConnect, testnet } from "@midl-xyz/midl-js-core";
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "~/__tests__/wagmiConfig";
import { WagmiMidlProvider } from "~/provider";

const queryClient = new QueryClient();

const config = createConfig({
	networks: [testnet],
	connectors: [satsConnect()],
});

export const wrapper = ({ children }: { children: ReactNode }) => {
	return (
		<MidlProvider config={config}>
			<WagmiProvider config={wagmiConfig}>
				<QueryClientProvider client={queryClient}>
					<WagmiMidlProvider />
					{children}
				</QueryClientProvider>
			</WagmiProvider>
		</MidlProvider>
	);
};
