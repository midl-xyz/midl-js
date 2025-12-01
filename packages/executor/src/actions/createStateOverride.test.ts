import { AddressPurpose, connect } from "@midl/core";
import { http, createTestClient, toHex } from "viem";
import { midl } from "viem/chains";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { mockServer } from "~/__tests__/mockServer";
import { addTxIntention } from "~/actions/addTxIntention";
import { createStateOverride } from "~/actions/createStateOverride";
import { satoshisToWei } from "~/utils";

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
				address: "0xC352456F2121D9087e91CddCFdBcc21573580D04",
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
				address: "0xC352456F2121D9087e91CddCFdBcc21573580D04",
				balance: satoshisToWei(3000),
			},
		]);
	});

	it("overrides runes balance", async () => {
		const intention = await addTxIntention(midlConfig, {
			deposit: {
				runes: [
					{
						id: "1:1",
						amount: 100n,
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
				address: "0xC352456F2121D9087e91CddCFdBcc21573580D04",
				balance: 0n,
			},
			{
				address: "0xAdAC646EE206551982085B9a4069a5cEF6D51863",
				stateDiff: [
					{
						slot: "0x43aa7f5234ae948b329328d8a23c0950f62f29f83d050ffb6df33834cb32aebe",
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
						id: "1:1",
						amount: 100n,
					},
					{
						id: "1:2",
						amount: 200n,
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
				address: "0xC352456F2121D9087e91CddCFdBcc21573580D04",
				balance: 0n,
			},
			{
				address: "0xAdAC646EE206551982085B9a4069a5cEF6D51863",
				stateDiff: [
					{
						slot: "0x43aa7f5234ae948b329328d8a23c0950f62f29f83d050ffb6df33834cb32aebe",
						value: toHex(100n, { size: 32 }),
					},
				],
			},
			{
				address: "0x319bef31D1e19c6447B941CBfe19da597ad9ED59",
				stateDiff: [
					{
						slot: "0x43aa7f5234ae948b329328d8a23c0950f62f29f83d050ffb6df33834cb32aebe",
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
						id: "1:1",
						amount: 100n,
					},
				],
			},
		});
		const intention2 = await addTxIntention(midlConfig, {
			deposit: {
				runes: [
					{
						id: "1:1",
						amount: 200n,
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
				address: "0xC352456F2121D9087e91CddCFdBcc21573580D04",
				balance: 0n,
			},
			{
				address: "0xAdAC646EE206551982085B9a4069a5cEF6D51863",
				stateDiff: [
					{
						slot: "0x43aa7f5234ae948b329328d8a23c0950f62f29f83d050ffb6df33834cb32aebe",
						value: toHex(300n, { size: 32 }),
					},
				],
			},
		]);
	});
});
