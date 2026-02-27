import { regtest } from "@midl/core";
import { MidlProvider } from "@midl/react";
import {
	ConnectButton,
	createMidlConfig,
	SatoshiKitProvider,
} from "@midl/satoshi-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// biome-ignore lint/correctness/noUnusedImports: This import is required
import React from "react";

const config = createMidlConfig({
	networks: [regtest],
	persist: true,
});

const Wallet = () => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				paddingBlock: "4rem",
			}}
		>
			<ConnectButton />
		</div>
	);
};

export const Example = () => {
	const queryClient = new QueryClient();

	return (
		<MidlProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<SatoshiKitProvider>
					<Wallet />
				</SatoshiKitProvider>
			</QueryClientProvider>
		</MidlProvider>
	);
};
