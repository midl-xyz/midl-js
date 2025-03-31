import {
	KeyPairConnector,
	createConfig,
	regtest,
} from "@midl-xyz/midl-js-core";
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getKeyPair } from "~/__tests__/keyPair";
import { SatoshiKitProvider } from "~/app";
import type { AuthenticationAdapter } from "~/feature/auth";

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
