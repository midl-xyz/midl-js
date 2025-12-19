// @vitest-environment node

import { describe, expect, it } from "vitest";
import { calculateTransactionsCost } from "~/utils/calculateTransactionsCost";

describe("calculateTransactionCost", () => {
	it("deposit", async () => {
		expect(calculateTransactionsCost(0n, { feeRate: 2 })).toBe(748);
	});

	it("withdraw", async () => {
		expect(calculateTransactionsCost(736676n, { feeRate: 2 })).toBe(822);
	});

	it("withdraw", async () => {
		expect(
			calculateTransactionsCost(0n, { feeRate: 2, hasWithdraw: true }),
		).toBe(788);
	});

	it("runes deposit", async () => {
		expect(
			calculateTransactionsCost(0n, {
				feeRate: 2,
				hasRunesDeposit: true,
			}),
		).toBe(864);
	});

	it("runes withdraw", async () => {
		expect(
			calculateTransactionsCost(0n, {
				feeRate: 2,
				hasRunesWithdraw: true,
				assetsToWithdrawSize: 1,
			}),
		).toBe(1990);
	});

	it("deposit", async () => {
		expect(calculateTransactionsCost(0n, { feeRate: 2 })).toBe(748);
	});
});
