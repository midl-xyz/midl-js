// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
	calculateTransactionsCost,
	MIN_ATTACHED_FEE_RATE,
} from "~/utils/calculateTransactionsCost";

// The attached value is priced at max(MIN_ATTACHED_FEE_RATE, feeRate): the
// node enforces the same floor when checking the TSS output value, so a
// below-floor fee rate must not produce a below-floor attachment. All cases
// below use feeRate 2, i.e. the floored rate of 25 applies.
describe("calculateTransactionCost", () => {
	it("deposit", async () => {
		expect(calculateTransactionsCost(0n, { feeRate: 2 })).toBe(9896);
	});

	it("deposit with gas", async () => {
		expect(calculateTransactionsCost(736676n, { feeRate: 2 })).toBe(9970);
	});

	it("withdraw", async () => {
		expect(
			calculateTransactionsCost(0n, { feeRate: 2, hasWithdraw: true }),
		).toBe(10396);
	});

	it("runes deposit", async () => {
		expect(
			calculateTransactionsCost(0n, {
				feeRate: 2,
				hasRunesDeposit: true,
			}),
		).toBe(11346);
	});

	it("runes withdraw", async () => {
		expect(
			calculateTransactionsCost(0n, {
				feeRate: 2,
				hasRunesWithdraw: true,
				assetsToWithdrawSize: 1,
			}),
		).toBe(25421);
	});

	// A fee rate above the floor is used as-is: the floor is a floor, not a cap.
	it("deposit above the floor", async () => {
		expect(calculateTransactionsCost(0n, { feeRate: 30 })).toBe(546 + 374 * 30);
	});

	// Exactly at the floor the two formulas agree.
	it("deposit at the floor boundary", async () => {
		expect(
			calculateTransactionsCost(0n, { feeRate: MIN_ATTACHED_FEE_RATE }),
		).toBe(calculateTransactionsCost(0n, { feeRate: 2 }));
	});
});
