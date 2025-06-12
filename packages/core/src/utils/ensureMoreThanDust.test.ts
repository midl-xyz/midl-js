import { describe, expect, it } from "vitest";
import { ensureMoreThanDust } from "~/utils/ensureMoreThanDust";

describe("core | utils | ensureMoreThanDust", () => {
	it("returns min btc value", () => {
		expect(ensureMoreThanDust(546)).toBe(547);
	});

	it("custom dust threshold", () => {
		expect(ensureMoreThanDust(547, 548)).toBe(548);
	});

	it("return original value", () => {
		expect(ensureMoreThanDust(548)).toBe(548);
	});
});
