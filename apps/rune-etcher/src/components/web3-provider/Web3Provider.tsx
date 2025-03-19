"use client";

import {
	createConfig,
	testnet,
	LeatherConnector,
	UnisatConnector,
	mainnet,
	testnet4,
	regtest,
} from "@midl-xyz/midl-js-core";
import { createXverseConnector } from "@midl-xyz/midl-js-core/connectors/xverse";
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const config = createConfig({
	networks: [testnet, testnet4, mainnet, regtest],
	connectors: [
		createXverseConnector(),
		new UnisatConnector(),
		new LeatherConnector(),
	],
	persist: true,
});

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<MidlProvider config={config}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</MidlProvider>
	);
};
