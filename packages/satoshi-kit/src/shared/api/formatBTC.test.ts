import { describe, expect, it } from "vitest";
import { formatBTC } from "~/shared";

describe("satoshi-kit | shared | api | formatBTC", () => {
	it("should format satoshi to BTC", () => {
		const satoshi = 123456789;
		const formatted = formatBTC(satoshi);
		expect(formatted).toBe("1.2346");
	});

	it("should handle decimals", () => {
		const satoshi = 123456789;
		const formatted = formatBTC(satoshi, 2);
		expect(formatted).toBe("1.23");
	});

	it("should return '0' for 0 satoshi", () => {
		const formatted = formatBTC(0);
		expect(formatted).toBe("0");
	});

	it("should handle negative satoshi", () => {
		const formatted = formatBTC(-123456789);
		expect(formatted).toBe("-1.2346");
	});

	it("should handle large numbers", () => {
		const satoshi = 205998352;
		const formatted = formatBTC(satoshi);
		expect(formatted).toBe("2.06");
	});
});
