import type { AddressPurpose } from "~/constants";
import type { BitcoinNetwork, Config } from "~/createConfig";

export type ConnectParams = {
	purposes: AddressPurpose[];
	network?: BitcoinNetwork;
};

export class ConnectError extends Error {
	constructor(msg: string) {
		super(msg);
		this.name = "ConnectError";
	}
}

export class EmptyAccountsError extends ConnectError {
	constructor() {
		super("Empty accounts");
		this.name = "EmptyAccountsError";
	}
}

export class WalletConnectionError extends ConnectError {
	constructor() {
		super("No wallet connection");
		this.name = "WalletConnectionError";
	}
}

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

	if (accounts.length === 0) {
		throw new EmptyAccountsError();
	}

	config.setState({
		connection: connector,
		accounts,
		network: params.network ?? network,
	});

	return accounts;
};
