// @vitest-environment node

import { describe, expect, it } from "vitest";
import { calculateTransactionsCost } from "~/utils/calculateTransactionsCost";

describe("calculateTransactionCost", () => {
	it("deposit", async () => {
		expect(
			calculateTransactionsCost([], { feeRate: 2, hasDeposit: true }),
		).toBe(822n);
	});

	it("withdraw", async () => {
		expect(
			calculateTransactionsCost([], { feeRate: 2, hasWithdraw: true }),
		).toBe(908n);
	});

	it("runes deposit", async () => {
		expect(
			calculateTransactionsCost([], {
				feeRate: 2,
				hasRunesDeposit: true,
			}),
		).toBe(1434n);
	});

	it("runes withdraw", async () => {
		expect(
			calculateTransactionsCost([], {
				feeRate: 2,
				hasRunesWithdraw: true,
			}),
		).toBe(1384n);
	});

	it("no deposit or withdraw", async () => {
		expect(
			calculateTransactionsCost([], {
				feeRate: 2,
			}),
		).toBe(442n);
	});
});
