import { applySpacers, getSpacersVal } from "@midl/runelib";
import { describe, expect, it } from "vitest";

describe("core | actions | etchRune", () => {
	it("should etch a rune", async () => {
		const name = "DOG•PUPPY•DOGGY•DOG";
		const spacers = getSpacersVal(name);
		const spacedName = applySpacers(name.replace(/•/g, ""), spacers);

		expect(spacedName).toBe(name);
	});
});
