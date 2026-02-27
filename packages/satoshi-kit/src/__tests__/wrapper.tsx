import { createConfig, regtest } from "@midl/core";
import { keyPairConnector } from "@midl/node";
import { MidlProvider } from "@midl/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { __TEST__MNEMONIC__ } from "~/__tests__/keyPair";
import { SatoshiKitProvider } from "~/app";
import type { AuthenticationAdapter } from "~/features/auth";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			experimental_prefetchInRender: true,
		},
	},
});

export const testConnector = keyPairConnector({ mnemonic: __TEST__MNEMONIC__ });

export const midlConfig = createConfig({
	connectors: [keyPairConnector({ mnemonic: __TEST__MNEMONIC__ })],
	networks: [regtest],
});

export const Wrapper = ({
	children,
	adapter,
}: {
	children: ReactNode;
	adapter?: AuthenticationAdapter;
}) => {
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
