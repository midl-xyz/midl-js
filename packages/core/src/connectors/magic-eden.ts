import {
	type CreateConnectorFn,
	createConnector,
} from "~/connectors/createConnector";
import { SatsConnectConnector } from "~/connectors/sats-connect";

// DO NOT USE THIS CONNECTOR
// This connector is not implemented correctly
// TODO: magic eden doesn't support `request` function
export const magicEdenConnector: CreateConnectorFn = ({ metadata } = {}) =>
	createConnector(
		{
			metadata: {
				name: "MagicEden",
			},
			create: () => {
				const defaultProviderId = "magicEden.bitcoin";

				return new SatsConnectConnector(defaultProviderId);
			},
		},
		metadata,
	);
