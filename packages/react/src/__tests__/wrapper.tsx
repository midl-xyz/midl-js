import { createConfig, regtest, satsConnect, testnet } from "@midl-xyz/midl-js-core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { MidlProvider } from "../context";

const queryClient = new QueryClient();

const config = createConfig({
	networks: [regtest],
	connectors: [satsConnect()],
});

export const wrapper = ({ children }: { children: ReactNode }) => {
	return (
		<MidlProvider config={config}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</MidlProvider>
	);
};
