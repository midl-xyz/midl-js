import { createConfig, leather, regtest } from "@midl-xyz/midl-js-core";
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { ConnectButton, SatoshiKitProvider } from "@midl-xyz/satoshi-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const config = createConfig({
	connectors: [leather()],
	networks: [regtest],
	persist: true,
});

export const Example = () => {
	const queryClient = new QueryClient();

	return (
		<MidlProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<SatoshiKitProvider>
					<ConnectButton />
				</SatoshiKitProvider>
			</QueryClientProvider>
		</MidlProvider>
	);
};
