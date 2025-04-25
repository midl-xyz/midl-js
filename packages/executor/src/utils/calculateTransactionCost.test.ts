// @vitest-environment node

import { describe, expect, it } from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { calculateTransactionsCost } from "~/utils/calculateTransactionsCost";

describe("calculateTransactionCost", () => {
	it("deposit", async () => {
		expect(
			await calculateTransactionsCost([], midlConfig, { hasDeposit: true }),
		).toBe(792n);
	});

	it("withdraw", async () => {
		expect(
			await calculateTransactionsCost([], midlConfig, { hasWithdraw: true }),
		).toBe(742n);
	});

	it("runes deposit", async () => {
		expect(
			await calculateTransactionsCost([], midlConfig, {
				hasRunesDeposit: true,
			}),
		).toBe(1318n);
	});

	it("runes withdraw", async () => {
		expect(
			await calculateTransactionsCost([], midlConfig, {
				hasRunesWithdraw: true,
			}),
		).toBe(1218n);
	});

	it("no deposit or withdraw", async () => {
		expect(await calculateTransactionsCost([], midlConfig, {})).toBe(412n);
	});
});
