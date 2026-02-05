import { AddressPurpose } from "~/constants/index.js";
import type { BitcoinNetwork, Config } from "~/createConfig.js";
import type { EnsureAllEnum } from "~/types/index.js";

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

const purposeOrder: EnsureAllEnum<typeof AddressPurpose> = [
	AddressPurpose.Payment,
	AddressPurpose.Ordinals,
];

/**
 * Connects to a wallet connector and retrieves user accounts for the specified purposes and network.
 *
 * @param config - The configuration object.
 * @param params - Connection parameters, including address purposes and optional network.
 * @param connectorId - (Optional) The ID of the connector to use. Defaults to the first connector if not provided.
 *
 * @throws {EmptyAccountsError} If the connector returns no accounts.
 *
 * @returns A promise that resolves to the list of connected accounts.
 *
 * @example
 * ```typescript
 * const accounts = await connect(config, { purposes: [AddressPurpose.Payment] });
 * ```
 */
export const connect = async (
	config: Config,
	params: ConnectParams,
	connectorId?: string,
) => {
	const { connectors, network } = config.getState();

	const connector =
		connectors.find((c) => c.id === connectorId) ?? connectors[0];

	if (!connector) {
		throw new ConnectError("No connector found");
	}

	const accounts = await connector.connect({
		...params,
		network: params.network ?? network,
	});

	if (accounts.length === 0) {
		throw new EmptyAccountsError();
	}

	config.setState({
		connection: connector,
		accounts: accounts.sort(
			(a, b) =>
				purposeOrder.indexOf(a.purpose) - purposeOrder.indexOf(b.purpose),
		),
		network: params.network ?? network,
	});

	return accounts;
};
