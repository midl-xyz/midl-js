import { describe, expect, it } from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { calculateTransactionsCost } from "~/utils/calculateTransactionsCost";

describe("calculateTransactionCost", () => {
	it("deposit", async () => {
		expect(
			await calculateTransactionsCost([], midlConfig, { hasDeposit: true }),
		).toBe(788n);
	});

	it("withdraw", async () => {
		expect(
			await calculateTransactionsCost([], midlConfig, { hasWithdraw: true }),
		).toBe(738n);
	});

	it("runes deposit", async () => {
		expect(
			await calculateTransactionsCost([], midlConfig, {
				hasRunesDeposit: true,
			}),
		).toBe(1314n);
	});

	it("runes withdraw", async () => {
		expect(
			await calculateTransactionsCost([], midlConfig, {
				hasRunesWithdraw: true,
			}),
		).toBe(1214n);
	});

	it("no deposit or withdraw", async () => {
		expect(await calculateTransactionsCost([], midlConfig, {})).toBe(410n);
	});
});
