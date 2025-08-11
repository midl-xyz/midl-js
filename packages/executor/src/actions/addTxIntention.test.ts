import {
	AddressPurpose,
	connect,
	createConfig,
	getDefaultAccount,
	regtest,
} from "@midl-xyz/midl-js-core";
import { keyPairConnector } from "@midl-xyz/midl-js-node";
import { beforeAll, describe, expect, it } from "vitest";
import { __TEST__MNEMONIC__ } from "~/__tests__/keyPair";
import { addTxIntention } from "~/actions/addTxIntention";
import { getEVMAddress } from "~/utils";

describe("executor | actions | addTxIntention", () => {
	const config = createConfig({
		networks: [regtest],
		connectors: [
			keyPairConnector({
				mnemonic: __TEST__MNEMONIC__,
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

		const evmAddress = getEVMAddress(
			getDefaultAccount(config),
			config.getState().network,
		);

		expect(assignedTxIntention.evmTransaction?.from).toEqual(evmAddress);
	});
});
