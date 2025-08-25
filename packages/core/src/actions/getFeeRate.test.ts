import { describe, expect, it } from "vitest";
import { createConfig } from "~/createConfig";
import { mainnet, regtest, testnet4 } from "~/networks";
import { getFeeRate } from "./getFeeRate";

describe("core | actions | getFeeRate", () => {
	it("returns the fee rate for mainnet correctly", async () => {
		const config = createConfig({
			networks: [mainnet],
			connectors: [],
		});
		const currentFeeRate = await getFeeRate(config);
		const estimateFeeRate = await (
			await fetch("https://mempool.space/api/v1/fees/recommended")
		).json();

		expect(currentFeeRate).toEqual(estimateFeeRate);
	});

	it("returns the fee rate for testnet correctly", async () => {
		const config = createConfig({
			networks: [testnet4],
			connectors: [],
		});
		const currentFeeRate = await getFeeRate(config);
		const estimateFeeRate = await (
			await fetch("https://mempool.space/testnet4/api/v1/fees/recommended")
		).json();

		expect(currentFeeRate).toEqual(estimateFeeRate);
	});

	it("returns the fee rate for regtest correctly", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
		});
		const currentFeeRate = await getFeeRate(config);
		const estimateFeeRate = await (
			await fetch("https://mempool.regtest.midl.xyz/api/v1/fees/recommended")
		).json();

		expect(currentFeeRate).toEqual(estimateFeeRate);
	});

	it("throws error if config doesn't contains network", async () => {
		const config = createConfig({
			networks: [],
			connectors: [],
		});
		await expect(getFeeRate(config)).rejects.toThrowError("No network");
	});
});
