import { regtest } from "@midl/core";
import { MidlProvider } from "@midl/react";
import {
	ConnectButton,
	SatoshiKitProvider,
	createMidlConfig,
} from "@midl/satoshi-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
