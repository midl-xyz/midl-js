import {
	createConfig,
	keyPairConnector,
	regtest,
} from "@midl-xyz/midl-js-core";
import * as bitcoin from "bitcoinjs-lib";
import { getKeyPair } from "~/__tests__/keyPair";

export const midlConfig = createConfig({
	networks: [regtest],
	connectors: [
		keyPairConnector({
			keyPair: getKeyPair(bitcoin.networks.regtest),
		}),
	],
});
