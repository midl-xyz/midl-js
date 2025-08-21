import { type CreateConnectorFn, createConnector } from "@midl/core";
import { XverseConnector } from "~/providers";

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

				return new XverseConnector(providerId || defaultProviderId);
			},
		},
		metadata,
	);
