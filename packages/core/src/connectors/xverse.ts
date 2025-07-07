import {
	type CreateConnectorFn,
	createConnector,
} from "~/connectors/createConnector";
import { SatsConnectConnector } from "~/connectors/sats-connect";

export const xverseConnector: CreateConnectorFn = ({ metadata } = {}) =>
	createConnector(
		{
			metadata: {
				name: "Xverse",
			},
			create: () => {
				const defaultProviderId = "XverseProviders.BitcoinProvider";

				const providerId =
					typeof window !== "undefined"
						? window.btc_providers?.find((it) => it.name.includes("Xverse"))?.id
						: "XverseProviders.BitcoinProvider";

				return new SatsConnectConnector(providerId || defaultProviderId);
			},
		},
		metadata,
	);
