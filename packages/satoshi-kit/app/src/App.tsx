import { signet } from "@midl-xyz/midl-js-core";
import { WagmiMidlProvider } from "@midl-xyz/midl-js-executor-react";
import { MidlProvider } from "@midl-xyz/midl-js-react";
import {
	ConnectButton,
	SatoshiKitProvider,
	createMidlConfig,
} from "@midl-xyz/satoshi-kit";
import "@midl-xyz/satoshi-kit/styles.css";
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
