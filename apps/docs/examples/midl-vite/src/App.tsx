import { WagmiMidlProvider } from "@midl-xyz/midl-js-executor-react";
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import "./App.css";
import { midlConfig } from "./midlConfig";
import { queryClient } from "./query-client";
import { wagmiConfig } from "./wagmiConfig";
import { YourApp } from "./YourApp";

function App() {
	return (
		<WagmiProvider config={wagmiConfig}>
			<MidlProvider config={midlConfig}>
				<QueryClientProvider client={queryClient}>
					<WagmiMidlProvider />

					<YourApp />
				</QueryClientProvider>
			</MidlProvider>
		</WagmiProvider>
	);
}
export default App;
