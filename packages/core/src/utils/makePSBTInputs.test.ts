import { randomBytes } from "node:crypto";
import type { UTXO } from "bitcoinselect";
import { beforeAll, describe, expect, it } from "vitest";
import { mockServer } from "~/__tests__/mockServer";
import { createConfig } from "~/createConfig";
import { mainnet, regtest } from "~/networks";
import { getBitcoinAddress } from "./fixtures/getBitcoinAddress";
import { makePSBTInputs } from "./makePSBTInputs";

const txid0 = randomBytes(32).toString("hex");
const txid1 = randomBytes(32).toString("hex");
const vout0 = 0;
const vout1 = 1;
const value0 = 100000000;
const value1 = 307689786;

const utxos: UTXO[] = [
	{
		txid: txid0,
		vout: vout0,
		value: value0,
	},
	{
		txid: txid1,
		vout: vout1,
		value: value1,
	},
];

const config = createConfig({
	networks: [mainnet],
	connectors: [],
});

describe("core | utils | makePSBTInputs", () => {
	beforeAll(() => {
		mockServer.listen();
	});

	it("should return inputs for P2WPKH addresses correctly", async () => {
		const { accountp2wpkhMainnet, p2wpkhMainnet } = getBitcoinAddress();
		const scripts = p2wpkhMainnet.output;

		const resultInputs = await makePSBTInputs(
			config,
			accountp2wpkhMainnet,
			utxos,
		);

		expect(resultInputs.length).toBe(2);

		expect(resultInputs[0].hash).toEqual(txid0);
		expect(resultInputs[0].index).toEqual(vout0);
		expect(resultInputs[0].witnessUtxo).toEqual({
			script: scripts,
			value: BigInt(value0),
		});

		expect(resultInputs[1].hash).toEqual(txid1);
		expect(resultInputs[1].index).toEqual(vout1);
		expect(resultInputs[1].witnessUtxo).toEqual({
			script: scripts,
			value: BigInt(value1),
		});
	});

	it("should return inputs for P2TR addresses correctly", async () => {
		const { p2trMainnet, accountp2trMainnet } = getBitcoinAddress();

		const scripts = p2trMainnet.output;

		const resultInputs = await makePSBTInputs(
			config,
			accountp2trMainnet,
			utxos,
		);

		expect(resultInputs.length).toBe(2);

		expect(resultInputs[0].hash).toEqual(txid0);
		expect(resultInputs[0].index).toEqual(vout0);
		expect(resultInputs[0].witnessUtxo).toEqual({
			script: scripts,
			value: BigInt(value0),
		});
		expect(resultInputs[1].hash).toEqual(txid1);
		expect(resultInputs[1].index).toEqual(vout1);
		expect(resultInputs[1].witnessUtxo).toEqual({
			script: scripts,
			value: BigInt(value1),
		});
	});

	it("should return inputs for P2SH_P2WPKH addresses correctly", async () => {
		const { accountp2shRegtest, p2shRegtest } = getBitcoinAddress();
		const scripts = p2shRegtest.redeem?.output;

		const config = createConfig({
			networks: [regtest],
			connectors: [],
		});

		const resultInputs = await makePSBTInputs(
			config,
			accountp2shRegtest,
			utxos,
		);
		const hex =
			"010000000100000000000000000000000000000000000000000000000000000000000000000000000000ffffffff0100f2052a010000000000000000";
		expect(resultInputs.length).toBe(2);

		expect(resultInputs[0].hash).toEqual(txid0);
		expect(resultInputs[0].index).toEqual(vout0);
		expect(resultInputs[0].nonWitnessUtxo).toEqual(Buffer.from(hex, "hex"));
		expect(resultInputs[0].redeemScript).toEqual(scripts);

		expect(resultInputs[1].hash).toEqual(txid1);
		expect(resultInputs[1].index).toEqual(vout1);
		expect(resultInputs[1].redeemScript).toEqual(scripts);
		expect(resultInputs[1].nonWitnessUtxo).toEqual(Buffer.from(hex, "hex"));
	});

	it("trows if config doesn't contain network", async () => {
		const { accountp2trMainnet } = getBitcoinAddress();

		const config = createConfig({
			networks: [],
			connectors: [],
		});

		await expect(
			makePSBTInputs(config, accountp2trMainnet, utxos),
		).rejects.toThrowError("No network");
	});

	it("trows if address type is unknown", async () => {
		const { accountIncorrectAddressTypeAddreess } = getBitcoinAddress();

		await expect(
			makePSBTInputs(config, accountIncorrectAddressTypeAddreess, utxos),
		).rejects.toThrowError("Unknown address type");
	});
});
