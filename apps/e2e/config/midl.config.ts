import { createConfig, regtest } from "@midl/core";
import { keyPairConnector } from "@midl/node";

export const midlConfig = createConfig({
	networks: [regtest],
	connectors: [
		keyPairConnector({
			mnemonic:
				process.env.MNEMONIC ??
				"test test test test test test test test test test test junk",
		}),
	],
});
