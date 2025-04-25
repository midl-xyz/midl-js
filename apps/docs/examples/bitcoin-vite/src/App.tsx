import { MidlProvider } from "@midl-xyz/midl-js-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query-client";
import { midlConfig } from "./midlConfig";
import "./App.css";
import { YourApp } from "./YourApp";

function App() {
	return (
		<MidlProvider config={midlConfig}>
			<QueryClientProvider client={queryClient}>
				<h1>Bitcoin</h1>
				<YourApp />
			</QueryClientProvider>
		</MidlProvider>
	);
}

export default App;
