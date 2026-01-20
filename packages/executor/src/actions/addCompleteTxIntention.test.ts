import { AddressPurpose, connect, disconnect } from "@midl/core";
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

		expect(txData.args[1]).toBe(txData.args[0]);
	});

	it("adds a complete transaction intention with runes withdrawal", async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});
		const intention = await addCompleteTxIntention(midlConfig, {
			runes: [
				{
					id: "1:1",
					amount: maxUint256,
				},
			],
		});

		const txData = decodeFunctionData({
			abi: executorAbi,
			// biome-ignore lint/style/noNonNullAssertion: Data is guaranteed to be present
			data: intention.evmTransaction?.data!,
		});

		expect(txData.args[3]).toStrictEqual([maxUint256]);
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
			"0x00000000000000000000001407185fa28850eb2b0dfdbf26f6b528a1a6b34b3f",
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
			"0x000000000000000000a9146699cd1847db9a8f6e1120bad6fae4d5ee13334f87",
		);

		await disconnect(midlConfigP2SH);
	});

	it("sets receiver p2wpkh", async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Payment],
		});

		const intention = await addCompleteTxIntention(midlConfig);
		const txData = decodeFunctionData({
			abi: executorAbi,
			// biome-ignore lint/style/noNonNullAssertion: Data is guaranteed to be present
			data: intention.evmTransaction?.data!,
		});

		expect(txData.args[0]).toBe(
			"0x00000000000000000000001407185fa28850eb2b0dfdbf26f6b528a1a6b34b3f",
		);
	});

	it("sets receiver p2sh-p2wpkh", async () => {
		await connect(midlConfigP2SH, {
			purposes: [AddressPurpose.Payment],
		});

		const intention = await addCompleteTxIntention(midlConfigP2SH);

		const txData = decodeFunctionData({
			abi: executorAbi,
			// biome-ignore lint/style/noNonNullAssertion: Data is guaranteed to be present
			data: intention.evmTransaction?.data!,
		});

		expect(txData.args[0]).toBe(
			"0x000000000000000000a9146699cd1847db9a8f6e1120bad6fae4d5ee13334f87",
		);

		await disconnect(midlConfigP2SH);
	});
});
