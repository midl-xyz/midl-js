import { regtest, testnet4 } from "@midl-xyz/midl-js-core";
import { describe, expect, it } from "vitest";
import { midlRegtest, midlTestnet4 } from "~/config/chains";
import { getEVMFromBitcoinNetwork } from "~/utils/getEVMFromBitcoinNetwork";

describe("getEVMFromBitcoinNetwork", () => {
	it("should return regtest for regtest", () => {
		expect(getEVMFromBitcoinNetwork(regtest)).toBe(midlRegtest);
	});

	it("should return testnet4 for testnet4", () => {
		expect(getEVMFromBitcoinNetwork(testnet4)).toBe(midlTestnet4);
	});

	it("should throw an error for an unsupported network", () => {
		expect(() =>
			// biome-ignore lint/suspicious/noExplicitAny: This is a test case
			getEVMFromBitcoinNetwork({ id: "unsupported" } as any),
		).toThrowError("Unsupported network: unsupported");
	});
});
