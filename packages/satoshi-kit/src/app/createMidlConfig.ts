import {
	bitgetConnector,
	leatherConnector,
	magicEdenConnector,
	phantomConnector,
	unisatConnector,
	xverseConnector,
} from "@midl/connectors";
import { createConfig } from "@midl/core";

type ConfigParams = Omit<Parameters<typeof createConfig>[0], "connectors"> & {
	connectors?: Parameters<typeof createConfig>[0]["connectors"];
};

export const createMidlConfig = (params: ConfigParams) => {
	return createConfig({
		connectors: [
			leatherConnector({
				metadata: {
					group: "popular",
				},
			}),
			xverseConnector({
				metadata: {
					isPartner: true,
					group: "popular",
				},
			}),
			bitgetConnector(),
			unisatConnector(),
			phantomConnector(),
			magicEdenConnector(),
		],
		...params,
	});
};
