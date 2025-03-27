import {
	KeyPairConnector,
	createConfig,
	regtest,
} from "@midl-xyz/midl-js-core";
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { vi } from "vitest";
import { getKeyPair } from "~/__tests__/keyPair";
import { SatoshiKitProvider } from "~/app";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			experimental_prefetchInRender: true,
		},
	},
});

const midlConfig = createConfig({
	connectors: [new KeyPairConnector(getKeyPair())],
	networks: [regtest],
});

export const wrapper = ({ children }: { children: ReactNode }) => {
	return (
		<MidlProvider config={midlConfig}>
			<SatoshiKitProvider>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</SatoshiKitProvider>
		</MidlProvider>
	);
};
