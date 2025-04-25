import {
	createConfig,
	regtest,
	LeatherConnector,
} from "@midl-xyz/midl-js-core";

export default createConfig({
	networks: [regtest],
	connectors: [new LeatherConnector()],
	persist: true,
});
