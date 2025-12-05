import { encodeFunctionData } from "viem";
import { describe, expect, it } from "vitest";
import { SystemContracts } from "~/config";
import { executorAbi } from "~/contracts";
import type { TransactionIntention } from "~/types";
import { aggregateIntentionRunes } from "~/utils/aggregateIntentionRunes";
import { runeIdToBytes32 } from "~/utils/runeIdToBytes32";

const mockData: TransactionIntention[] = [
	// Standard deposit and withdraw for the same rune
	{
		deposit: {
			runes: [{ id: "1:0", amount: 100n, address: "0x123" }],
		},
		withdraw: {
			runes: [{ id: "1:0", amount: 50n, address: "0x456" }],
		},
	},
	// Withdraw for the same rune, different address
	{
		withdraw: {
			runes: [{ id: "1:0", amount: 100n, address: "0x123" }],
		},
	},
	// Deposit for a different rune
	{
		deposit: {
			runes: [{ id: "2:0", amount: 200n, address: "0x789" }],
		},
	},
	// Withdraw for a different rune
	{
		withdraw: {
			runes: [{ id: "2:0", amount: 10n, address: "0x789" }],
		},
	},
	// Deposit with multiple runes
	{
		deposit: {
			runes: [
				{ id: "1:0", amount: 5n, address: "0xabc" },
				{ id: "3:0", amount: 50n, address: "0xdef" },
			],
		},
	},
	// Withdraw as boolean (should be ignored)
	{
		withdraw: true,
	},
	// Deposit with empty runes array
	{
		deposit: {
			runes: [],
		},
	},
	// Withdraw with empty runes array
	{
		withdraw: {
			runes: [],
		},
	},
	// No deposit/withdraw
	{},
];

describe("executor | utils | aggregateIntentionRunes", () => {
	it("aggregates withdrawals", () => {
		const runes = aggregateIntentionRunes(mockData, "withdraw");
		expect(runes).toEqual([
			{ id: "1:0", value: 150n, address: "0x123", isRequestAddAsset: false },
			{ id: "2:0", value: 10n, address: "0x789", isRequestAddAsset: false },
		]);
	});

	it("aggregates deposits", () => {
		const runes = aggregateIntentionRunes(mockData, "deposit");
		expect(runes).toEqual([
			{ id: "1:0", value: 105n, address: "0xabc", isRequestAddAsset: false },
			{ id: "2:0", value: 200n, address: "0x789", isRequestAddAsset: false },
			{ id: "3:0", value: 50n, address: "0xdef", isRequestAddAsset: false },
		]);
	});

	it("handles multiple rune IDs", () => {
		const intentions: TransactionIntention[] = [
			{
				deposit: {
					runes: [
						{ id: "1:0", amount: 10n, address: "0x1" },
						{ id: "2:0", amount: 20n, address: "0x2" },
					],
				},
			},
			{
				deposit: {
					runes: [
						{ id: "1:0", amount: 5n, address: "0x1" },
						{ id: "3:0", amount: 30n, address: "0x3" },
					],
				},
			},
		];
		const runes = aggregateIntentionRunes(intentions, "deposit");
		expect(runes).toEqual([
			{ id: "1:0", value: 15n, address: "0x1", isRequestAddAsset: false },
			{ id: "2:0", value: 20n, address: "0x2", isRequestAddAsset: false },
			{ id: "3:0", value: 30n, address: "0x3", isRequestAddAsset: false },
		]);
	});

	it("returns empty array if no runes present", () => {
		const intentions: TransactionIntention[] = [
			{},
			{ deposit: {} },
			{ withdraw: true },
		];
		expect(aggregateIntentionRunes(intentions, "deposit")).toEqual([]);
		expect(aggregateIntentionRunes(intentions, "withdraw")).toEqual([]);
	});

	it("ignores intentions with withdraw as boolean", () => {
		const intentions: TransactionIntention[] = [
			{ withdraw: true },
			{ withdraw: false },
			{ withdraw: { runes: [{ id: "1:0", amount: 1n, address: "0x1" }] } },
		];
		expect(aggregateIntentionRunes(intentions, "withdraw")).toEqual([
			{ id: "1:0", value: 1n, address: "0x1", isRequestAddAsset: false },
		]);
	});

	it("handles requestAddAsset intentions", () => {
		const randomAddress = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";

		const intentions: TransactionIntention[] = [
			{
				evmTransaction: {
					chainId: 1,
					to: SystemContracts.Executor,
					data: encodeFunctionData({
						abi: executorAbi,
						functionName: "requestAddAsset",
						args: [randomAddress, runeIdToBytes32("1:0")],
					}),
				},
				deposit: {
					runes: [{ id: "1:0", amount: 15n, address: randomAddress }],
				},
			},
		];
		const runes = aggregateIntentionRunes(intentions, "deposit");
		expect(runes).toEqual([
			{
				id: "1:0",
				value: 15n,
				address: randomAddress,
				isRequestAddAsset: true,
			},
		]);
	});
});
