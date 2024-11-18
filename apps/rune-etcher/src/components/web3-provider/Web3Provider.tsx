"use client";

import {
	createConfig,
	testnet,
	unisat,
	leather,
	mainnet,
	testnet4,
	regtest,
	satsConnect,
} from "@midl-xyz/midl-js-core";
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const config = createConfig({
	networks: [testnet, testnet4, mainnet, regtest],
	connectors: [unisat(), leather(), satsConnect()],
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
