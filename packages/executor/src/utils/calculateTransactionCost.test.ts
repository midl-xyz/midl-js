import { describe, expect, it } from "vitest";
import { createConfig } from "wagmi";
import { wagmiConfig } from "~/__tests__";
import { midlConfig } from "~/__tests__/midlConfig";
import { calculateTransactionsCost } from "~/utils/calculateTransactionsCost";

describe("calculateTransactionCost", () => {
	it("deposit", async () => {
		expect(
			await calculateTransactionsCost([], midlConfig, { hasDeposit: true }),
		).toBe(786n);
	});

	it("withdraw", async () => {
		expect(
			await calculateTransactionsCost([], midlConfig, { hasWithdraw: true }),
		).toBe(736n);
	});

	it("runes deposit", async () => {
		expect(
			await calculateTransactionsCost([], midlConfig, {
				hasRunesDeposit: true,
			}),
		).toBe(1310n);
	});

	it("runes withdraw", async () => {
		expect(
			await calculateTransactionsCost([], midlConfig, {
				hasRunesWithdraw: true,
			}),
		).toBe(1210n);
	});
});
