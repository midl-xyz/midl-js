import { createConfig, regtest } from "@midl/core";
import { keyPairConnector } from "@midl/node";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { __TEST__MNEMONIC__ } from "~/__tests__/keyPair";
import { MidlProvider } from "../context";

const queryClient = new QueryClient();

export const midlConfig = createConfig({
	networks: [regtest],
	connectors: [keyPairConnector({ mnemonic: __TEST__MNEMONIC__ })],
});

export const wrapper = ({ children }: { children: ReactNode }) => {
	return (
		<MidlProvider config={midlConfig}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</MidlProvider>
	);
};
