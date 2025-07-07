import {
	type CreateConnectorFn,
	createConnector,
} from "@midl-xyz/midl-js-core";
import { SatsConnectConnector } from "~/providers";

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
				console.warn("Magic Eden connector is not implemented correctly");
				const defaultProviderId = "magicEden.bitcoin";

				return new SatsConnectConnector(defaultProviderId);
			},
		},
		metadata,
	);
