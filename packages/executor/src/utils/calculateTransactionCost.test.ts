// @vitest-environment node

import { describe, expect, it } from "vitest";
import { calculateTransactionsCost } from "~/utils/calculateTransactionsCost";

describe("calculateTransactionCost", () => {
	it("deposit", async () => {
		expect(calculateTransactionsCost(0n, { feeRate: 2 })).toBe(410n);
	});

	it("withdraw", async () => {
		expect(
			calculateTransactionsCost(0n, { feeRate: 2, hasWithdraw: true }),
		).toBe(496n);
	});

	it("runes deposit", async () => {
		expect(
			calculateTransactionsCost(0n, {
				feeRate: 2,
				hasRunesDeposit: true,
			}),
		).toBe(936n);
	});

	it("runes withdraw", async () => {
		expect(
			calculateTransactionsCost(0n, {
				feeRate: 2,
				hasRunesWithdraw: true,
				assetsToWithdrawSize: 1,
			}),
		).toBe(1978n);
	});
});
