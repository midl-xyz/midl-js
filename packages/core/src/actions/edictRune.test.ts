import * as bitcoin from "bitcoinjs-lib";
import { Runestone } from "runelib";
import { beforeAll, describe, expect, it } from "vitest";
import { getKeyPair } from "~/__tests__/keyPair";
import { makeRandomAddress } from "~/__tests__/makeRandomAddress";
import { mockServer } from "~/__tests__/mockServer";
import { edictRune } from "~/actions/edictRune";
import { keyPair } from "~/connectors/keyPair";
import { AddressPurpose } from "~/constants";
import { type Config, createConfig } from "~/createConfig";
import { regtest } from "~/networks";

describe("core | actions | edictRune", () => {
	let config: Config;

	beforeAll(async () => {
		mockServer.listen();

		config = createConfig({
			networks: [regtest],
			connectors: [
				keyPair({
					keyPair: getKeyPair(),
				}),
			],
		});

		await config.connectors[0].connect({ purposes: [AddressPurpose.Ordinals] });
	});

	it.skip("should throw if more than 1 edict", async () => {
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

	it("has runes", async () => {
		const rawTx =
			"02000000000102c587c9eeef77cb7321c91c860c2950b9677e7fd28ef8e3cd4f0e0ae6b1e0d3cc0100000000ffffffffa7c50b5658a0d692b9ff82f1d60de7a81cc77e22f0475774a0d6eabff52076b20300000000ffffffff05e00c00000000000016001484b101912b438978e5e27ed98d31b23143f3e0c7220200000000000016001484b101912b438978e5e27ed98d31b23143f3e0c72202000000000000225120e3a6aedbedea55703355b6ed25c7e8e2ed5864e3fec671e036531e4423420016d778b60600000000225120e3a6aedbedea55703355b6ed25c7e8e2ed5864e3fec671e036531e44234200160000000000000000186a5d15160200e89a040180808096d0a5b2ec84ededee070101400415c0430491912cec3d52b9638a03f47c844fd33ebb7f0c6d0302f1d39b0902fb07c03a1ea336b2ec48e2b7d23bcfcacaef73489a41cebd085d8a388e8c207f01407f358aff863cc803ac9c57df52ce2a0485e920864f80d9b0829273e0c201dbcfa50ce2f4ca23d1d26b6bbc73cab01e1e399cfa9ba37615aa108c79d25b2038a300000000";
		const stone = Runestone.decipher(rawTx);

		console.log(stone.value()?.edicts);
	});
});
