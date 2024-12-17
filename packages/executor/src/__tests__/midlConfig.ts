import { createConfig, leather, regtest } from "@midl-xyz/midl-js-core";
import { keyPair } from "@midl-xyz/midl-js-core/dist/connectors/keyPair";
import { getKeyPair } from "~/__tests__/keyPair";
import * as bitcoin from "bitcoinjs-lib";

export const midlConfig = createConfig({
	networks: [regtest],
	connectors: [
		keyPair({
			keyPair: getKeyPair(bitcoin.networks.regtest),
		}),
	],
});
