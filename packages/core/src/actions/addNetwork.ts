import type { NetworkConfig } from "~/connectors";
import type { Config } from "~/createConfig";

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
