"use client";

import { mainnet, regtest, testnet, testnet4 } from "@midl-xyz/midl-js-core";
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { SatoshiKitProvider, createMidlConfig } from "@midl-xyz/satoshi-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const config = createMidlConfig({
	networks: [testnet, testnet4, mainnet, regtest],
	persist: true,
});

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<MidlProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<SatoshiKitProvider>{children}</SatoshiKitProvider>
			</QueryClientProvider>
		</MidlProvider>
	);
};
