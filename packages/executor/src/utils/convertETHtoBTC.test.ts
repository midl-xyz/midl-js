import { parseUnits } from "viem";
import { describe, expect, it } from "vitest";
import { convertETHtoBTC } from "~/utils/convertETHtoBTC";

describe("convertETHtoBTC", () => {
	it("less than 1 satoshi", () => {
		expect(convertETHtoBTC(1n)).toBe(1);
	});

	it("converts 1 satoshi", () => {
		expect(convertETHtoBTC(parseUnits("1", 10))).toBe(1);
	});

	it("converts", () => {
		expect(convertETHtoBTC(parseUnits("1", 11))).toBe(10);
	});

	it("converts 1 ether to 1 btc", () => {
		expect(convertETHtoBTC(parseUnits("1", 18))).toBe(100_000_000);
	});
});
