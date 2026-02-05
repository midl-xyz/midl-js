import { describe, expect, it } from "vitest";
import { formatRuneName } from "./formatRuneName.js";

describe("core | utils | formatRuneName", () => {
	it("throws error if name is empty string", () => {
		expect(() => formatRuneName("")).toThrow("Rune name cannot be empty");
		expect(() => formatRuneName(" ")).toThrow("Rune name cannot be empty");
	});

	it("throws error if rune name contains non-allowed characters (A-Z and •)", () => {
		expect(() => formatRuneName("!A")).toThrowError(
			"Rune name can only contain A-Z and • placed between letters",
		);

		expect(() => formatRuneName("ñ")).toThrowError(
			"Rune name can only contain A-Z and • placed between letters",
		);

		expect(() => formatRuneName("1")).toThrowError(
			"Rune name can only contain A-Z and • placed between letters",
		);
	});

	it("throws error if rune name contains • is not located between letters", () => {
		expect(() => formatRuneName("B••C")).toThrowError(
			"Rune name can only contain A-Z and • placed between letters",
		);
		expect(() => formatRuneName("•B•C")).toThrowError(
			"Rune name can only contain A-Z and • placed between letters",
		);
		expect(() => formatRuneName("B•C•")).toThrowError(
			"Rune name can only contain A-Z and • placed between letters",
		);
	});

	it("returns rune name if name contains only 1 letter", () => {
		expect(formatRuneName("A")).toBe("A");
	});

	it("returns rune name with • if name contains letters and •", () => {
		expect(formatRuneName("RUNE•NAME")).toBe("RUNE•NAME");
	});

	it("returns rune name in upper case format", () => {
		expect(formatRuneName("Rune•Name")).toBe("RUNE•NAME");
	});

	it("returns the name of the rune with spaces removed before and after the name", () => {
		expect(formatRuneName("     RUNE•NAME    ")).toBe("RUNE•NAME");
		expect(formatRuneName("     RUNE•NAME")).toBe("RUNE•NAME");
		expect(formatRuneName("RUNE•NAME    ")).toBe("RUNE•NAME");
	});

	it("throws error if length of the rune name is more than 26 letters", async () => {
		expect(() =>
			formatRuneName("IN•THIS•RUNE•NAME•TWENTY•SEVEN•SY"),
		).toThrowError("Rune name can contain up to 26 letters");
	});

	it("returns rune name if length contains 26 letter", async () => {
		expect(formatRuneName("IN•THIS•RUNE•NAME•TWENTY•SIX•SYM")).toBe(
			"IN•THIS•RUNE•NAME•TWENTY•SIX•SYM",
		);
	});
});
