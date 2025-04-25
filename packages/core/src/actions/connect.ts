import type { AddressPurpose } from "~/constants";
import type { BitcoinNetwork, Config } from "~/createConfig";

export type ConnectParams = {
	purposes: AddressPurpose[];
	network?: BitcoinNetwork;
};

export const connect = async (
	config: Config,
	params: ConnectParams,
	connectorId?: string,
) => {
	const { connectors, network } = config.getState();

	const connector =
		connectors.find((c) => c.id === connectorId) ?? connectors[0];

	const accounts = await connector.connect({
		...params,
		network: params.network ?? network,
	});

	config.setState({
		connection: connector,
		accounts,
		network: params.network ?? network,
	});

	return accounts;
};
