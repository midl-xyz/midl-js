import { AddressPurpose, connect, disconnect } from "@midl-xyz/midl-js-core";
import { decodeFunctionData } from "viem";
import { afterEach, describe, expect, it } from "vitest";
import { midlConfig, midlConfigP2SH } from "~/__tests__/midlConfig";
import { addCompleteTxIntention } from "~/actions/addCompleteTxIntention";
import { executorAbi } from "~/contracts";

describe("executor | actions | addCompleteTxIntention", () => {
	afterEach(async () => {
		await disconnect(midlConfig);
	});

	it("adds a complete transaction intention", async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});

		const intention = await addCompleteTxIntention(midlConfig, []);

		const txData = decodeFunctionData({
			abi: executorAbi,
			// biome-ignore lint/style/noNonNullAssertion: Data is guaranteed to be present
			data: intention.evmTransaction.data!,
		});

		expect(txData.args[1]).toBe(
			"0x0000000000000000000000000000000000000000000000000000000000000000",
		);
	});

	it("adds a complete transaction intention with runes withdrawal", async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});
		const intention = await addCompleteTxIntention(
			midlConfig,
			[],
			["0x17C646bad1Ee22e6945E3fC5D9732077ED211560"],
		);

		const txData = decodeFunctionData({
			abi: executorAbi,
			// biome-ignore lint/style/noNonNullAssertion: Data is guaranteed to be present
			data: intention.evmTransaction.data!,
		});

		expect(txData.args[2]).toStrictEqual([
			"0x17C646bad1Ee22e6945E3fC5D9732077ED211560",
		]);

		expect(txData.args[3]).toStrictEqual([0n]);
	});

	it("sets BTC receiver p2wpkh", async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});

		const intention = await addCompleteTxIntention(midlConfig, []);
		const txData = decodeFunctionData({
			abi: executorAbi,
			// biome-ignore lint/style/noNonNullAssertion: Data is guaranteed to be present
			data: intention.evmTransaction.data!,
		});

		expect(txData.args[1]).toBe(
			"0x000000000000000000000014a015251a19acaa8f09fa87408912a80102a6b1d6",
		);
	});

	it("sets BTC receiver p2sh-p2wpkh", async () => {
		await connect(midlConfigP2SH, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});

		const intention = await addCompleteTxIntention(midlConfigP2SH, []);

		const txData = decodeFunctionData({
			abi: executorAbi,
			// biome-ignore lint/style/noNonNullAssertion: Data is guaranteed to be present
			data: intention.evmTransaction.data!,
		});

		expect(txData.args[1]).toBe(
			"0x000000000000000000a91401dd18d62651e73291e2187e5dab5ba7afee9ef187",
		);

		await disconnect(midlConfigP2SH);
	});
});
