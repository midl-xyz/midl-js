import { AddressPurpose, connect } from "@midl-xyz/midl-js-core";
import { describe, expect, it } from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { getEVMAddress } from "~/utils/getEVMAddress";

describe("utils | getEVMAddress", () => {
	it("should return the EVM address", async () => {
		const expectedEVMAddress = "0x5E5b88DEfa1A412C69644CB47E68107d97807E35";

		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});

		const { accounts, network } = midlConfig.getState();

		if (!accounts || accounts.length === 0) {
			throw new Error("No accounts found in midlConfig");
		}

		expect(getEVMAddress(accounts[0], network)).toBe(expectedEVMAddress);
	});
});
