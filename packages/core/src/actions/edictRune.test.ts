import * as bitcoin from "bitcoinjs-lib";
import { Runestone } from "runelib";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { makeRuneUTXO } from "~/__tests__/fixtures/utxo";
import { getKeyPair } from "~/__tests__/keyPair";
import { makeRandomAddress } from "~/__tests__/makeRandomAddress";
import { mockServer } from "~/__tests__/mockServer";
import { connect } from "~/actions/connect";
import { edictRune } from "~/actions/edictRune";
import { KeyPairConnector, keyPairConnector } from "~/connectors";
import { AddressPurpose } from "~/constants";
import { type Config, createConfig } from "~/createConfig";
import { regtest } from "~/networks";
import * as mod from "./getRuneUTXO";

describe("core | actions | edictRune", () => {
	let config: Config;

	beforeAll(async () => {
		mockServer.listen();

		config = createConfig({
			networks: [regtest],
			connectors: [keyPairConnector({ keyPair: getKeyPair() })],
		});

		await connect(config, { purposes: [AddressPurpose.Ordinals] });
	});

	afterAll(() => {
		mockServer.close();
	});

	it("should throw if more than 2 edicts", async () => {
		const mock = vi
			.spyOn(mod, "getRuneUTXO")
			.mockImplementation(async () => [
				makeRuneUTXO("1:1", 100n, 0),
				makeRuneUTXO("2:1", 100n, 0),
				makeRuneUTXO("3:1", 100n, 0),
			]);

		await expect(() =>
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
					{
						runeId: "3:1",
						amount: 100n,
						receiver: makeRandomAddress(bitcoin.networks.regtest),
					},
				],
			}),
		).rejects.toThrowError("Only two edicts per transaction is allowed");

		mock.mockRestore();
	});

	it("should create correct PSBT", async () => {
		const mock = vi
			.spyOn(mod, "getRuneUTXO")
			.mockImplementation(async () => [
				makeRuneUTXO("1:1", 100n, 0),
				makeRuneUTXO("1:1", 100n, 0),
			]);

		const data = await edictRune(config, {
			transfers: [
				{
					runeId: "1:1",
					amount: 200n,
					receiver: makeRandomAddress(bitcoin.networks.regtest),
				},
			],
		});

		const psbt = bitcoin.Psbt.fromBase64(data.psbt, {
			network: bitcoin.networks.regtest,
		});

		const stone = Runestone.decipher(psbt.extractTransaction().toHex());

		expect(stone.value()?.edicts.length).toBe(1);
		expect(stone.value()?.edicts[0].amount).toBe(200n);

		mock.mockRestore();
	});
});
