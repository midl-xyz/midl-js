import { createConnector } from "~/connectors";
import { SatsConnectConnector } from "~/connectors/sats-connect";

// DO NOT USE THIS CONNECTOR
// This connector is not implemented correctly
export const magicEden = () => {
	throw new Error("magicEden connector is not implemented correctly");

	// TODO: magic eden doesn't support `request` function
	// biome-ignore lint/correctness/noUnreachable: <explanation>
	return createConnector((config) => {
		const providerId = "magicEden.bitcoin";

		return new SatsConnectConnector(config, providerId);
	});
};
