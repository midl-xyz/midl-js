import {
	createConfig,
	LeatherConnector,
	regtest,
} from "@midl-xyz/midl-js-core";

export const midlConfig = createConfig({
	networks: [regtest],
	connectors: [new LeatherConnector()],
});
