import { xverseConnector } from "@midl-xyz/midl-js-connectors";
import { regtest } from "@midl-xyz/midl-js-core";
import {
	MidlProvider,
	useAddNetwork,
	useConfig,
} from "@midl-xyz/midl-js-react";
import {
	ConnectButton,
	SatoshiKitProvider,
	createMidlConfig,
} from "@midl-xyz/satoshi-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const config = createMidlConfig({
	networks: [regtest],
	persist: true,
});

const Wallet = () => {
	const { addNetworkAsync } = useAddNetwork();
	const { network } = useConfig();

	return (
		<ConnectButton
			beforeConnect={async (connectorId) => {
				if (network.id !== "regtest") {
					throw new Error("This example only works with the regtest network.");
				}

				if (connectorId !== xverseConnector().id) {
					return;
				}

				await addNetworkAsync({
					connectorId,
					networkConfig: {
						name: "MIDL Regtest",
						network: network.id,
						rpcUrl: "https://mempool.regtest.midl.xyz",
						indexerUrl: "https://api-regtest-midl.xverse.app",
					},
				});
			}}
		/>
	);
};

export const Example = () => {
	const queryClient = new QueryClient();

	return (
		<MidlProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<SatoshiKitProvider>
					<Wallet />
				</SatoshiKitProvider>
			</QueryClientProvider>
		</MidlProvider>
	);
};
