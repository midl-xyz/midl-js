import { AddressPurpose, connect, disconnect } from "@midl-xyz/midl-js-core";
import { decodeFunctionData, maxUint256 } from "viem";
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

		const intention = await addCompleteTxIntention(midlConfig);

		const txData = decodeFunctionData({
			abi: executorAbi,
			// biome-ignore lint/style/noNonNullAssertion: Data is guaranteed to be present
			data: intention.evmTransaction?.data!,
		});

		expect(txData.args[1]).toBe(
			"0x0000000000000000000000000000000000000000000000000000000000000000",
		);
	});

	it("adds a complete transaction intention with runes withdrawal", async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});
		const intention = await addCompleteTxIntention(midlConfig, {
			runes: [
				{
					id: "1:1",
					address: "0x17C646bad1Ee22e6945E3fC5D9732077ED211560",
					amount: maxUint256,
				},
			],
		});

		const txData = decodeFunctionData({
			abi: executorAbi,
			// biome-ignore lint/style/noNonNullAssertion: Data is guaranteed to be present
			data: intention.evmTransaction?.data!,
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

		const intention = await addCompleteTxIntention(midlConfig);
		const txData = decodeFunctionData({
			abi: executorAbi,
			// biome-ignore lint/style/noNonNullAssertion: Data is guaranteed to be present
			data: intention.evmTransaction?.data!,
		});

		expect(txData.args[1]).toBe(
			"0x00000000000000000000001415482f4b93ef03beb1e4c6dd7ca3fdb93be7708f",
		);
	});

	it("sets BTC receiver p2sh-p2wpkh", async () => {
		await connect(midlConfigP2SH, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});

		const intention = await addCompleteTxIntention(midlConfigP2SH);

		const txData = decodeFunctionData({
			abi: executorAbi,
			// biome-ignore lint/style/noNonNullAssertion: Data is guaranteed to be present
			data: intention.evmTransaction?.data!,
		});

		expect(txData.args[1]).toBe(
			"0x000000000000000000a9148229402b9417ef59116b7196a8ae655fbfd9777b87",
		);

		await disconnect(midlConfigP2SH);
	});
});
