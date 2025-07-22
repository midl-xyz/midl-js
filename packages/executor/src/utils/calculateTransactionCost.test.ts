// @vitest-environment node

import { describe, expect, it } from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { calculateTransactionsCost } from "~/utils/calculateTransactionsCost";

describe("calculateTransactionCost", () => {
	it("deposit", async () => {
		expect(
			calculateTransactionsCost([], { feeRate: 2, hasDeposit: true }),
		).toBe(792n);
	});

	it("withdraw", async () => {
		expect(
			calculateTransactionsCost([], { feeRate: 2, hasWithdraw: true }),
		).toBe(742n);
	});

	it("runes deposit", async () => {
		expect(
			calculateTransactionsCost([], {
				feeRate: 2,
				hasRunesDeposit: true,
			}),
		).toBe(1318n);
	});

	it("runes withdraw", async () => {
		expect(
			calculateTransactionsCost([], {
				feeRate: 2,
				hasRunesWithdraw: true,
			}),
		).toBe(1218n);
	});

	it("no deposit or withdraw", async () => {
		expect(
			calculateTransactionsCost([], {
				feeRate: 2,
			}),
		).toBe(412n);
	});
});
