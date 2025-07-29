import {
	AddressPurpose,
	connect,
	createConfig,
	getDefaultAccount,
	regtest,
} from "@midl-xyz/midl-js-core";
import { keyPairConnector } from "@midl-xyz/midl-js-node";
import * as bitcoin from "bitcoinjs-lib";
import { beforeAll, describe, expect, it } from "vitest";
import { getKeyPair } from "~/__tests__/keyPair";
import { addTxIntention } from "~/actions/addTxIntention";
import { getEVMAddress } from "~/utils";

describe("executor | actions | addTxIntention", () => {
	const config = createConfig({
		networks: [regtest],
		connectors: [
			keyPairConnector({
				keyPair: getKeyPair(bitcoin.networks.regtest),
			}),
		],
	});

	beforeAll(async () => {
		await connect(config, { purposes: [AddressPurpose.Payment] });
	});

	it("adds a transaction intention", async () => {
		const assignedTxIntention = await addTxIntention(config, {
			evmTransaction: {
				value: 0n,
			},
		});

		const evmAddress = getEVMAddress(config, getDefaultAccount(config));

		expect(assignedTxIntention.evmTransaction.from).toEqual(evmAddress);
	});
});
