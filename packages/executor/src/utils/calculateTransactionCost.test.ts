// @vitest-environment node

import { describe, expect, it } from "vitest";
import { calculateTransactionsCost } from "~/utils/calculateTransactionsCost";

describe("calculateTransactionCost", () => {
	it("deposit", async () => {
		expect(calculateTransactionsCost(0n, { feeRate: 2 })).toBe(1294);
	});

	it("withdraw", async () => {
		expect(calculateTransactionsCost(736676n, { feeRate: 2 })).toBe(1368);
	});

	it("withdraw", async () => {
		expect(
			calculateTransactionsCost(0n, { feeRate: 2, hasWithdraw: true }),
		).toBe(1334);
	});

	it("runes deposit", async () => {
		expect(
			calculateTransactionsCost(0n, {
				feeRate: 2,
				hasRunesDeposit: true,
			}),
		).toBe(1410);
	});

	it("runes withdraw", async () => {
		expect(
			calculateTransactionsCost(0n, {
				feeRate: 2,
				hasRunesWithdraw: true,
				assetsToWithdrawSize: 1,
			}),
		).toBe(2536);
	});

	it("deposit", async () => {
		expect(calculateTransactionsCost(0n, { feeRate: 2 })).toBe(1294);
	});
});
