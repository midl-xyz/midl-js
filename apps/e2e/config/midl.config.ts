import { createConfig, regtest } from "@midl/core";
import { keyPairConnector } from "@midl/node";

export const midlConfig = createConfig({
	networks: [regtest],
	// biome-ignore lint/style/noNonNullAssertion: Private key is always defined
	connectors: [keyPairConnector({ mnemonic: process.env.MNEMONIC! })],
});
