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

	it("should throw if more than 1 edict", async () => {
		expect(() =>
			edictRune(config, {
				transfers: [
					{
						runeId: "1:1",
						amount: 100n,
						receiver: makeRandomAddress(bitcoin.networks.regtest),
					},
					{
						runeId: "2:1",
						amount: 100n,
						receiver: makeRandomAddress(bitcoin.networks.regtest),
					},
				],
			}),
		).rejects.toThrowError("Only one edict per transaction is allowed");
	});
});
