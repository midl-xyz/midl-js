import { Psbt } from "bitcoinjs-lib";
import { beforeAll, describe, expect, it } from "vitest";
import { keyPair } from "~/__tests__/keyPair";
import { makeRandomAddress } from "~/__tests__/makeRandomAddress";
import { mockServer } from "~/__tests__/mockServer";
import { edictRune } from "~/actions/edictRune";
import { devnet } from "~/chains";
import { mock } from "~/connectors";
import { AddressPurpose } from "~/constants";
import { type Config, createConfig } from "~/createConfig";
import { regtest } from "~/networks";
import * as bitcoin from "bitcoinjs-lib";

describe("core | actions | edictRune", () => {
	let config: Config;

	beforeAll(async () => {
		mockServer.listen();

		config = createConfig({
			networks: [regtest],
			chain: devnet,
			connectors: [
				mock({
					keyPair: keyPair,
				}),
			],
		});

		await config.connectors[0].connect({ purposes: [AddressPurpose.Ordinals] });
	});

	it("should create correct psbt", async () => {
		const test = await edictRune(config, {
			transfers: [
				{
					runeId: "1:1",
					amount: 100n,
					receiver: makeRandomAddress(bitcoin.networks.regtest),
				},
			],
		});

		const psbt = Psbt.fromBase64(test.psbt);

		expect(psbt.txOutputs[0].script.toString("hex")).toBe(
			"76a914d2b6b6c5d3f7f9e2b6e1c7f2",
		);
	});
});
