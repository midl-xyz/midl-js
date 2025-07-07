import {
	bitgetConnector,
	createConfig,
	leatherConnector,
	phantomConnector,
	unisatConnector,
	xverseConnector,
} from "@midl-xyz/midl-js-core";

type ConfigParams = Omit<Parameters<typeof createConfig>[0], "connectors"> & {
	connectors?: Parameters<typeof createConfig>[0]["connectors"];
};

export const createMidlConfig = (params: ConfigParams) => {
	return createConfig({
		...params,
		connectors: [
			leatherConnector(),
			xverseConnector(),
			bitgetConnector(),
			unisatConnector(),
			phantomConnector(),
		],
	});
};
