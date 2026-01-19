import {
	bitgetConnector,
	leatherConnector,
	okxConnector,
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
			xverseConnector({
				metadata: {
					isPartner: true,
					group: "popular",
				},
			}),
			phantomConnector({}),
			leatherConnector({}),
			bitgetConnector(),
			unisatConnector(),
			okxConnector(),
			//magicEdenConnector(),
		],
		...params,
	});
};
