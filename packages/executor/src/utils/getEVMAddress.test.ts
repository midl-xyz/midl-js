import { AddressPurpose, AddressType, connect } from "@midl-xyz/midl-js-core";
import { describe, expect, it } from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { getPublicKey } from "~/actions";
import { getEVMAddress } from "~/utils/getEVMAddress";

describe("utils | getEVMAddress", () => {
	it("should return the EVM address", async () => {
		const expectedEVMAddress = "0x8Ccf062691b33747c2C0950621992BCDe33A8d5C";

		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});

		const { accounts } = midlConfig.getState();

		if (!accounts || accounts.length === 0) {
			throw new Error("No accounts found in midlConfig");
		}

		expect(getEVMAddress(midlConfig, accounts[0])).toBe(expectedEVMAddress);
	});
});
