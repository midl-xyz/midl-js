import { createConfig, keyPair, regtest } from "@midl-xyz/midl-js-core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { MidlProvider } from "../context";
import { getKeyPair } from "~/__tests__/keyPair";

const queryClient = new QueryClient();

const config = createConfig({
	networks: [regtest],
	connectors: [
		keyPair({
			keyPair: getKeyPair(),
		}),
	],
});

export const wrapper = ({ children }: { children: ReactNode }) => {
	return (
		<MidlProvider config={config}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</MidlProvider>
	);
};
