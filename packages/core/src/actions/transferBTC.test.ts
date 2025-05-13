import { Psbt } from "bitcoinjs-lib";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getKeyPair } from "~/__tests__/keyPair";
import { makeRandomAddress } from "~/__tests__/makeRandomAddress";
import { mockServer } from "~/__tests__/mockServer";
import { connect } from "~/actions/connect";
import { transferBTC } from "~/actions/transferBTC";
import { KeyPairConnector } from "~/connectors";
import { AddressPurpose } from "~/constants";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";

describe("core | actions | transferBTC", () => {
	beforeAll(() => {
		mockServer.listen();
	});

	afterAll(() => {
		mockServer.close();
	});

	it.skip("creates correct PSBT ", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [new KeyPairConnector(getKeyPair())],
		});

		await connect(config, {
			purposes: [AddressPurpose.Payment],
		});

		const receiver = makeRandomAddress();

		const data = await transferBTC(config, {
			transfers: [
				{
					amount: 1000,
					receiver,
				},
			],
		});

		const psbt = Psbt.fromBase64(data.psbt);

		const [output] = psbt.txOutputs;

		expect(output.address).toBe(receiver);
		expect(output.value).toBe(1000);
	});
});
