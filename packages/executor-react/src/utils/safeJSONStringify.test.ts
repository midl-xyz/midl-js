import { describe, it } from "vitest";
import { safeJSONStringify } from "~/utils/safeJSONStringify";

describe("executor-react | utils | safeJSONStringify", () => {
	it("stringifies an object with bigint values", () => {
		const obj = {
			id: 1,
			value: 12345678901234567890n,
			nested: {
				bigValue: 98765432109876543210n,
			},
		};

		const jsonString = safeJSONStringify(obj);
		const parsed = JSON.parse(jsonString);

		if (parsed.value !== "12345678901234567890") {
			throw new Error("BigInt value was not stringified correctly");
		}
		if (parsed.nested.bigValue !== "98765432109876543210") {
			throw new Error("Nested BigInt value was not stringified correctly");
		}
	});
});
