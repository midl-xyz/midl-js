import { expect, describe, it } from "vitest";
import { encodeRuneSymbol } from "~/utils/encodeRuneSymbol";

describe("core | utils | encodeRuneSymbol", () => {
	it("returns the symbol as a string if it is a single character", () => {
		const result = encodeRuneSymbol("A");
		expect(result.isSome()).toBe(true);
		expect(result.value()).toBe("A");
	});

	it("returns none if the symbol is undefined", () => {
		const result = encodeRuneSymbol(undefined);
		expect(result.isSome()).toBe(false);
	});

	it("return emoji as a string if it is a single character", () => {
		const result = encodeRuneSymbol("💊");
		expect(result.isSome()).toBe(true);
		expect(result.value()).toBe("💊");

		console.log("result", result.value());
	});
});
