import { AddressPurpose, AddressType, connect, mainnet } from "@midl/core";
import { describe, expect, it } from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { getEVMAddress } from "~/utils/getEVMAddress";

describe("utils | getEVMAddress", () => {
	it("returns the EVM address", async () => {
		const expectedEVMAddress = "0x7c88591052C56f2c0F94d34d4D73fcC1fDdbAFC1";

		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});

		const { accounts, network } = midlConfig.getState();

		if (!accounts || accounts.length === 0) {
			throw new Error("No accounts found in midlConfig");
		}

		expect(getEVMAddress(accounts[0], network)).toBe(expectedEVMAddress);

		expect(
			getEVMAddress(
				{
					address: "bc1qq2pag0uxxyafjdsmcmwkvkdf35hsawwc7s2d2t",
					addressType: AddressType.P2WPKH,
					publicKey:
						"02325cf56ca2f855c57aa9322c7bda605b165882b67d655359261855afe3f1788a",
					purpose: AddressPurpose.Payment,
				},
				mainnet,
			),
		).toBe("0x167c68Ce00173F6522E01e7798e3EE6B46Db463f");
	});
});
