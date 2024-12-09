import { formatUnits } from "viem";
import { describe, expect, it } from "vitest";
import { convertBTCtoETH } from "~/utils/convertBTCtoETH";

describe("convertBTCtoETH", () => {
	it("converts 1 satoshi", () => {
		expect(convertBTCtoETH(1)).toBe(10000000000n);
		expect(formatUnits(convertBTCtoETH(1), 18)).toBe("0.00000001");
	});
});
