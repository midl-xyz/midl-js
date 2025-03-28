import {
	createConfig,
	LeatherConnector,
	createBitGetConnector,
	UnisatConnector,
} from "@midl-xyz/midl-js-core";
import { createXverseConnector } from "@midl-xyz/midl-js-core/connectors/xverse";

type ConfigParams = Omit<Parameters<typeof createConfig>[0], "connectors">;

export const createMidlConfig = (params: ConfigParams) => {
	return createConfig({
		...params,
		connectors: [
			new LeatherConnector(),
			createXverseConnector(),
			createBitGetConnector(),
			new UnisatConnector(),
		],
	});
};
