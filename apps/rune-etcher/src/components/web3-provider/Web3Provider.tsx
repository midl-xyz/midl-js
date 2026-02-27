"use client";

import { mainnet, regtest, signet, testnet, testnet4 } from "@midl/core";
import { MidlProvider } from "@midl/react";
import { createMidlConfig, SatoshiKitProvider } from "@midl/satoshi-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const config = createMidlConfig({
	networks: [testnet, testnet4, signet, mainnet, regtest],
	persist: true,
});

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<MidlProvider config={config}>
				<SatoshiKitProvider>{children}</SatoshiKitProvider>
			</MidlProvider>
		</QueryClientProvider>
	);
};
