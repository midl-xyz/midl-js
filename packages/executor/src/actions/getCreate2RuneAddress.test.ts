import { describe, expect, it } from "vitest";
import { getCreate2RuneAddress } from "~/actions/getCreate2RuneAddress";

describe("getCreate2RuneAddress", () => {
	it("computes the correct address", async () => {
		expect(getCreate2RuneAddress("826:3")).toBe(
			"0x802d6d2c8BeCBB7fEA0C43460b556084e4E05e18",
		);
	});

	it("computes the correct address for another rune", async () => {
		expect(getCreate2RuneAddress("21779:1")).toBe(
			"0xb7D33659796DD5179866Ba105f6117147A381d75",
		);
	});
});
