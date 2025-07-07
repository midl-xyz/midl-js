import { createConfig, regtest } from "@midl-xyz/midl-js-core";
import { keyPairConnector } from "@midl-xyz/midl-js-node";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getKeyPair } from "~/__tests__/keyPair";
import { MidlProvider } from "../context";

const queryClient = new QueryClient();

export const midlConfig = createConfig({
	networks: [regtest],
	connectors: [keyPairConnector({ keyPair: getKeyPair() })],
});

export const wrapper = ({ children }: { children: ReactNode }) => {
	return (
		<MidlProvider config={midlConfig}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</MidlProvider>
	);
};
