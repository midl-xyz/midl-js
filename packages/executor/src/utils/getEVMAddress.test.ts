import { AddressPurpose, connect } from "@midl/core";
import { describe, expect, it } from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { getEVMAddress } from "~/utils/getEVMAddress";

describe("utils | getEVMAddress", () => {
	it("should return the EVM address", async () => {
		const expectedEVMAddress = "0x7c88591052C56f2c0F94d34d4D73fcC1fDdbAFC1";

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
