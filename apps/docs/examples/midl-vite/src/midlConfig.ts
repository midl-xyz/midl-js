import {
	createConfig,
	LeatherConnector,
	regtest,
} from "@midl-xyz/midl-js-core";
import { createXverseConnector } from "@midl-xyz/midl-js-core/connectors/xverse";

export const midlConfig = createConfig({
	networks: [regtest],
	connectors: [new LeatherConnector(), createXverseConnector()],
});
