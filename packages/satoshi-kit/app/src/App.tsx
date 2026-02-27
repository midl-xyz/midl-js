import { signet } from "@midl/core";
import { WagmiMidlProvider } from "@midl/executor-react";
import { MidlProvider } from "@midl/react";
import {
	ConnectButton,
	createMidlConfig,
	SatoshiKitProvider,
} from "@midl/satoshi-kit";
import "@midl/satoshi-kit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkModeToggle } from "./DarkModeToggle";
import "./global.css";

const midlConfig = createMidlConfig({
	networks: [signet],
	persist: true,
});

const client = new QueryClient({});

export function App() {
	return (
		<QueryClientProvider client={client}>
			<MidlProvider config={midlConfig}>
				<SatoshiKitProvider>
					<WagmiMidlProvider>
						<ConnectButton />
						<DarkModeToggle />
					</WagmiMidlProvider>
				</SatoshiKitProvider>
			</MidlProvider>
		</QueryClientProvider>
	);
}
