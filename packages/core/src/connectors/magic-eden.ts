import { SatsConnectConnector } from "~/connectors/sats-connect";

// DO NOT USE THIS CONNECTOR
// This connector is not implemented correctly
export const createMagicEdenConnector = () => {
	throw new Error("magicEden connector is not implemented correctly");

	// TODO: magic eden doesn't support `request` function

	// biome-ignore lint/correctness/noUnreachable: <explanation>
	const providerId = "magicEden.bitcoin";

	return new SatsConnectConnector(providerId, "MagicEden");
};
