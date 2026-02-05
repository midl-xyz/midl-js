import type { NetworkConfig } from "~/connectors/index.js";
import type { Config } from "~/createConfig.js";

/**
 * Adds a new network configuration to a connector.
 *
 * @param config - The configuration object
 * @param connectorId - The ID of the connector to which the network should be added.
 * @param networkConfig - The network configuration to add.
 *
 * @example
 * ```typescript
 * await addNetwork(config, "my-connector", {
 *   id: "testnet",
 *   name: "Testnet",
 *   rpcUrl: "https://...",
 *   // ...other network config fields
 * });
 * ```
 */
export const addNetwork = async (
	config: Config,
	connectorId: string,
	networkConfig: NetworkConfig,
) => {
	const { connectors } = config.getState();

	const connector = connectors.find((conn) => conn.id === connectorId);

	if (!connector) {
		throw new Error(`Connector with id ${connectorId} not found`);
	}

	if (typeof connector.addNetwork === "undefined") {
		throw new Error("Connector does not support adding networks");
	}

	return await connector.addNetwork(networkConfig);
};
