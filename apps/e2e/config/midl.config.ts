import { createConfig, regtest } from "@midl-xyz/midl-js-core";
import { keyPairConnector } from "@midl-xyz/midl-js-node";

export const midlConfig = createConfig({
	networks: [regtest],
	// biome-ignore lint/style/noNonNullAssertion: Private key is always defined
	connectors: [keyPairConnector({ mnemonic: process.env.MNEMONIC! })],
});
