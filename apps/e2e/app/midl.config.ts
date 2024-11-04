import { createConfig, devnet, testnet4, unisat } from "@midl-xyz/midl-js-core";

export default createConfig({
	chain: devnet,
	networks: [testnet4],
	connectors: [unisat()],
});
