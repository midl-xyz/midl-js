import {
	createConfig,
	devnet,
	regtest,
	leather,
	unisat,
} from "@midl-xyz/midl-js-core";

export default createConfig({
	chain: devnet,
	networks: [regtest],
	connectors: [leather(), unisat()],
});
