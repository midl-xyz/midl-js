import { createConfig, regtest } from "@midl-xyz/midl-js-core";
import { keyPairConnector } from "@midl-xyz/midl-js-node";
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getKeyPair } from "~/__tests__/keyPair";
import { SatoshiKitProvider } from "~/app";
import type { AuthenticationAdapter } from "~/features/auth";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			experimental_prefetchInRender: true,
		},
	},
});

export const testConnector = keyPairConnector({ keyPair: getKeyPair() });

export const midlConfig = createConfig({
	connectors: [keyPairConnector({ keyPair: getKeyPair() })],
	networks: [regtest],
});

export const Wrapper = ({
	children,
	adapter,
}: { children: ReactNode; adapter?: AuthenticationAdapter }) => {
	return (
		<MidlProvider config={midlConfig}>
			<SatoshiKitProvider authenticationAdapter={adapter}>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</SatoshiKitProvider>
		</MidlProvider>
	);
};
