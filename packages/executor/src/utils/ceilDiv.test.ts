import { describe, expect, it, suite } from "vitest";
import { ceilDiv } from "~/utils/ceilDiv";

describe("utils | ceilDiv", () => {
	suite("returns the ceiling of the division of two bigints", () => {
		const testCases: { a: bigint; b: bigint; expected: bigint }[] = [
			{ a: 10n, b: 3n, expected: 4n },
			{ a: 9n, b: 3n, expected: 3n },
			{ a: 7n, b: 2n, expected: 4n },
			{ a: 1n, b: 1n, expected: 1n },
			{ a: 0n, b: 5n, expected: 0n },
			{ a: 5n, b: 0n, expected: 0n }, // Edge case: division by zero
		];

		it.each(testCases)("ceilDiv($a, $b) should return $expected", ({
			a,
			b,
			expected,
		}) => {
			if (b === 0n) {
				// Handle division by zero case
				expect(() => ceilDiv(a, b)).toThrow();
			} else {
				const result = ceilDiv(a, b);
				expect(result).toBe(expected);
			}
		});
	});
});
