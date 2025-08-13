import {
	bitgetConnector,
	leatherConnector,
	magicEdenConnector,
	phantomConnector,
	unisatConnector,
	xverseConnector,
} from "@midl-xyz/midl-js-connectors";
import { createConfig } from "@midl-xyz/midl-js-core";

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
