import { parseUnits } from "viem";
import { describe, expect, it } from "vitest";
import { weiToSatoshis } from "~/utils/weiToSatoshis";

describe("weiToSatoshis", () => {
	it("less than 1 satoshi", () => {
		expect(weiToSatoshis(1n)).toBe(1);
	});

	it("converts 1 satoshi", () => {
		expect(weiToSatoshis(parseUnits("1", 10))).toBe(1);
	});

	it("converts", () => {
		expect(weiToSatoshis(parseUnits("1", 11))).toBe(10);
	});

	it("converts 1 ether to 1 btc", () => {
		expect(weiToSatoshis(parseUnits("1", 18))).toBe(100_000_000);
	});
});
