import { createConfig, regtest } from "@midl/core";
import { keyPairConnector } from "@midl/node";
import { __TEST__MNEMONIC__ } from "~/__tests__/keyPair";

export const midlConfig = createConfig({
	networks: [regtest],
	connectors: [
		keyPairConnector({
			mnemonic: __TEST__MNEMONIC__,
		}),
	],
});
