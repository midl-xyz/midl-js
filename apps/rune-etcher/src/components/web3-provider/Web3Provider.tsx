"use client";

import {
	MaestroSymphonyProvider,
	MempoolSpaceProvider,
	mainnet,
	regtest,
	signet,
	testnet,
	testnet4,
} from "@midl/core";
import { MidlProvider } from "@midl/react";
import { SatoshiKitProvider, createMidlConfig } from "@midl/satoshi-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const config = createMidlConfig({
	networks: [testnet, testnet4, signet, mainnet, regtest],
	persist: true,
	provider: new MempoolSpaceProvider({
		regtest: "https://mempool.staging.midl.xyz",
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} as any),
	runesProvider: new MaestroSymphonyProvider({
		regtest: "https://runes.staging.midl.xyz",
	}),
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
