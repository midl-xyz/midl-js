import { describe, expect, it } from "vitest";
import { getEVMAddress } from "~/utils/getEVMAddress";

describe("utils | getEVMAddress", () => {
	it("should return the EVM address", () => {
		const publicKey =
			"0xe3a6aedbedea55703355b6ed25c7e8e2ed5864e3fec671e036531e4423420016";

		const expectedEVMAddress = "0x5E5b88DEfa1A412C69644CB47E68107d97807E35";

		expect(getEVMAddress(publicKey)).toBe(expectedEVMAddress);
	});
});
