import { configure, configureSync, getConsoleSink } from "@midl-xyz/logger";
import { AddressPurpose, connect } from "@midl-xyz/midl-js-core";
import { http, createTestClient, toHex } from "viem";
import { midl } from "viem/chains";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { mockServer } from "~/__tests__/mockServer";
import { addTxIntention } from "~/actions/addTxIntention";
import { createStateOverride } from "~/actions/createStateOverride";
import { satoshisToWei } from "~/utils";

configureSync({
	sinks: {
		console: getConsoleSink(),
	},
	loggers: [
		{
			category: ["@midl-xyz/midl-js-executor"],
			lowestLevel: "debug",
			sinks: ["console"],
		},
		{ category: ["logtape", "meta"], sinks: [] },
	],
});

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
			deposit: {
				satoshis: 1000,
			},
		});

		const override = await createStateOverride(
			midlConfig,
			client,
			[intention],
			0n,
		);

		expect(override).toEqual([
			{
				address: "0xB4269d2BB4f19EB780f6698e1182B165729D69D5",
				balance: satoshisToWei(1000),
			},
		]);
	});

	it("overrides balance with multiple intentions", async () => {
		const intention1 = await addTxIntention(midlConfig, {
			deposit: {
				satoshis: 1000,
			},
		});
		const intention2 = await addTxIntention(midlConfig, {
			deposit: {
				satoshis: 2000,
			},
		});

		const override = await createStateOverride(
			midlConfig,
			client,
			[intention1, intention2],
			0n,
		);

		expect(override).toEqual([
			{
				address: "0xB4269d2BB4f19EB780f6698e1182B165729D69D5",
				balance: satoshisToWei(3000),
			},
		]);
	});

	it("overrides runes balance", async () => {
		const intention = await addTxIntention(midlConfig, {
			deposit: {
				runes: [
					{
						id: "rune1",
						amount: 100n,
						address: "0x17C646bad1Ee22e6945E3fC5D9732077ED211560",
					},
				],
			},
		});

		const override = await createStateOverride(
			midlConfig,
			client,
			[intention],
			0n,
		);

		expect(override).toEqual([
			{
				address: "0xB4269d2BB4f19EB780f6698e1182B165729D69D5",
				balance: 0n,
			},
			{
				address: "0x17C646bad1Ee22e6945E3fC5D9732077ED211560",
				stateDiff: [
					{
						slot: "0xb5262877dcb2e05e4c2fcd36b53fa917897266d4584d1ae9ba4cda3c06a3e566",
						value: toHex(100n, { size: 32 }),
					},
				],
			},
		]);
	});

	it("overrides runes balance with multiple runes", async () => {
		const intention = await addTxIntention(midlConfig, {
			deposit: {
				runes: [
					{
						id: "rune1",
						amount: 100n,
						address: "0x17C646bad1Ee22e6945E3fC5D9732077ED211560",
					},
					{
						id: "rune2",
						amount: 200n,
						address: "0x1234567890abcdef1234567890abcdef12345678",
					},
				],
			},
		});

		const override = await createStateOverride(
			midlConfig,
			client,
			[intention],
			0n,
		);

		expect(override).toEqual([
			{
				address: "0xB4269d2BB4f19EB780f6698e1182B165729D69D5",
				balance: 0n,
			},
			{
				address: "0x17C646bad1Ee22e6945E3fC5D9732077ED211560",
				stateDiff: [
					{
						slot: "0xb5262877dcb2e05e4c2fcd36b53fa917897266d4584d1ae9ba4cda3c06a3e566",
						value: toHex(100n, { size: 32 }),
					},
				],
			},
			{
				address: "0x1234567890abcdef1234567890abcdef12345678",
				stateDiff: [
					{
						slot: "0xb5262877dcb2e05e4c2fcd36b53fa917897266d4584d1ae9ba4cda3c06a3e566",
						value: toHex(200n, { size: 32 }),
					},
				],
			},
		]);
	});

	it("overrides rune's balance with multiple intentions", async () => {
		const intention1 = await addTxIntention(midlConfig, {
			deposit: {
				runes: [
					{
						id: "rune1",
						amount: 100n,
						address: "0x17C646bad1Ee22e6945E3fC5D9732077ED211560",
					},
				],
			},
		});
		const intention2 = await addTxIntention(midlConfig, {
			deposit: {
				runes: [
					{
						id: "rune1",
						amount: 200n,
						address: "0x17C646bad1Ee22e6945E3fC5D9732077ED211560",
					},
				],
			},
		});

		const override = await createStateOverride(
			midlConfig,
			client,
			[intention1, intention2],
			0n,
		);

		expect(override).toEqual([
			{
				address: "0xB4269d2BB4f19EB780f6698e1182B165729D69D5",
				balance: 0n,
			},
			{
				address: "0x17C646bad1Ee22e6945E3fC5D9732077ED211560",
				stateDiff: [
					{
						slot: "0xb5262877dcb2e05e4c2fcd36b53fa917897266d4584d1ae9ba4cda3c06a3e566",
						value: toHex(300n, { size: 32 }),
					},
				],
			},
		]);
	});
});
