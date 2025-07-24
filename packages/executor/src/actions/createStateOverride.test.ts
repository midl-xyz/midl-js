import { AddressPurpose, connect } from "@midl-xyz/midl-js-core";
import { http, createTestClient, toHex } from "viem";
import { midl } from "viem/chains";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { mockServer } from "~/__tests__/mockServer";
import { addTxIntention } from "~/actions/addTxIntention";
import { createStateOverride } from "~/actions/createStateOverride";
import { convertBTCtoETH } from "~/utils";

describe("executor | actions | createStateOverride", async () => {
	const client = createTestClient({
		chain: midl,
		mode: "hardhat",
		transport: http(),
	});

	beforeAll(async () => {
		mockServer.listen();

		await connect(midlConfig, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});
	});

	afterAll(() => {
		mockServer.close();
	});

	it("overrides balance", async () => {
		const intention = await addTxIntention(midlConfig, {
			satoshis: 1000,
		});

		const override = await createStateOverride(midlConfig, client, [intention]);

		expect(override).toEqual([
			{
				address: "0x6eA845739F3a623303D3a8d8C735FF8D89216176",
				balance: convertBTCtoETH(1000),
			},
		]);
	});

	it("overrides balance with multiple intentions", async () => {
		const intention1 = await addTxIntention(midlConfig, {
			satoshis: 1000,
		});
		const intention2 = await addTxIntention(midlConfig, {
			satoshis: 2000,
		});

		const override = await createStateOverride(midlConfig, client, [
			intention1,
			intention2,
		]);

		expect(override).toEqual([
			{
				address: "0x6eA845739F3a623303D3a8d8C735FF8D89216176",
				balance: convertBTCtoETH(3000),
			},
		]);
	});

	it("overrides runes balance", async () => {
		const intention = await addTxIntention(midlConfig, {
			runes: [
				{
					id: "rune1",
					value: 100n,
					address: "0x17C646bad1Ee22e6945E3fC5D9732077ED211560",
				},
			],
		});

		const override = await createStateOverride(midlConfig, client, [intention]);

		expect(override).toEqual([
			{
				address: "0x6eA845739F3a623303D3a8d8C735FF8D89216176",
				balance: 0n,
			},
			{
				address: "0x17C646bad1Ee22e6945E3fC5D9732077ED211560",
				stateDiff: [
					{
						slot: "0xa933a783e4f8fadea8a485778f83e1f900e8455c903f7edf07d2e0c5fba98f5d",
						value: toHex(100n, { size: 32 }),
					},
				],
			},
		]);
	});

	it("overrides runes balance with multiple runes", async () => {
		const intention = await addTxIntention(midlConfig, {
			runes: [
				{
					id: "rune1",
					value: 100n,
					address: "0x17C646bad1Ee22e6945E3fC5D9732077ED211560",
				},
				{
					id: "rune2",
					value: 200n,
					address: "0x1234567890abcdef1234567890abcdef12345678",
				},
			],
		});

		const override = await createStateOverride(midlConfig, client, [intention]);

		expect(override).toEqual([
			{
				address: "0x6eA845739F3a623303D3a8d8C735FF8D89216176",
				balance: 0n,
			},
			{
				address: "0x17C646bad1Ee22e6945E3fC5D9732077ED211560",
				stateDiff: [
					{
						slot: "0xa933a783e4f8fadea8a485778f83e1f900e8455c903f7edf07d2e0c5fba98f5d",
						value: toHex(100n, { size: 32 }),
					},
				],
			},
			{
				address: "0x1234567890abcdef1234567890abcdef12345678",
				stateDiff: [
					{
						slot: "0xa933a783e4f8fadea8a485778f83e1f900e8455c903f7edf07d2e0c5fba98f5d",
						value: toHex(200n, { size: 32 }),
					},
				],
			},
		]);
	});

	it("overrides rune's balance with multiple intentions", async () => {
		const intention1 = await addTxIntention(midlConfig, {
			runes: [
				{
					id: "rune1",
					value: 100n,
					address: "0x17C646bad1Ee22e6945E3fC5D9732077ED211560",
				},
			],
		});
		const intention2 = await addTxIntention(midlConfig, {
			runes: [
				{
					id: "rune1",
					value: 200n,
					address: "0x17C646bad1Ee22e6945E3fC5D9732077ED211560",
				},
			],
		});

		const override = await createStateOverride(midlConfig, client, [
			intention1,
			intention2,
		]);

		expect(override).toEqual([
			{
				address: "0x6eA845739F3a623303D3a8d8C735FF8D89216176",
				balance: 0n,
			},
			{
				address: "0x17C646bad1Ee22e6945E3fC5D9732077ED211560",
				stateDiff: [
					{
						slot: "0xa933a783e4f8fadea8a485778f83e1f900e8455c903f7edf07d2e0c5fba98f5d",
						value: toHex(300n, { size: 32 }),
					},
				],
			},
		]);
	});
});
