import { formatUnits } from "viem";
import { describe, expect, it } from "vitest";
import { satoshisToWei } from "~/utils/satoshisToWei";

describe("satoshisToWei", () => {
	it("converts 1 satoshi", () => {
		expect(satoshisToWei(1)).toBe(10000000000n);
		expect(formatUnits(satoshisToWei(1), 18)).toBe("0.00000001");
	});
});
