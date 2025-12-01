import { Psbt, networks } from "bitcoinjs-lib";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { __TEST__MNEMONIC__ } from "~/__tests__/keyPair";
import { makeRandomAddress } from "~/__tests__/makeRandomAddress";
import { mockServer } from "~/__tests__/mockServer";
import { connect } from "~/actions/connect";
import { transferBTC } from "~/actions/transferBTC";
import { AddressPurpose } from "~/constants";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";

describe("core | actions | transferBTC", async () => {
	const { keyPairConnector } = await import("@midl/node");

	beforeAll(() => {
		mockServer.listen();
	});

	afterAll(() => {
		mockServer.close();
	});

	it("creates correct PSBT ", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [keyPairConnector({ mnemonic: __TEST__MNEMONIC__ })],
		});

		await connect(config, {
			purposes: [AddressPurpose.Payment],
		});

		const receiver = makeRandomAddress(networks[regtest.network]);

		const data = await transferBTC(config, {
			transfers: [
				{
					amount: 1000,
					receiver,
				},
			],
		});

		const psbt = Psbt.fromBase64(data.psbt, {
			network: networks[regtest.network],
		});

		const [output] = psbt.txOutputs;

		expect(output.value).toBe(1000n);
		expect(output.address).toBe(receiver);
	});
});
