import { mainnet, regtest, signet, testnet, testnet4 } from "@midl/core";
import { describe, expect, it } from "vitest";
import type { MidlNetworkConfig } from "~/type-extensions";

import { getBitcoinNetwork } from "./getBitcoinNetwork";

describe("getBitcoinNetwork", () => {
	it("defaults to mainnet when network is undefined", () => {
		const config = {
			mnemonic: "test test test test test test test test test test test junk",
		} satisfies MidlNetworkConfig;

		expect(getBitcoinNetwork(config)).toBe(mainnet);
	});

	it("returns the provided BitcoinNetwork when network is an object", () => {
		const config = {
			mnemonic: "test test test test test test test test test test test junk",
			network: regtest,
		} satisfies MidlNetworkConfig;

		expect(getBitcoinNetwork(config)).toBe(regtest);
	});

	it("maps supported string network names", () => {
		const base = {
			mnemonic: "test test test test test test test test test test test junk",
		} satisfies MidlNetworkConfig;

		expect(getBitcoinNetwork({ ...base, network: "mainnet" })).toBe(mainnet);
		expect(getBitcoinNetwork({ ...base, network: "regtest" })).toBe(regtest);
		expect(getBitcoinNetwork({ ...base, network: "testnet" })).toBe(testnet);
		expect(getBitcoinNetwork({ ...base, network: "testnet4" })).toBe(testnet4);
		expect(getBitcoinNetwork({ ...base, network: "signet" })).toBe(signet);
	});

	it("throws for unsupported string network names", () => {
		const config = {
			mnemonic: "test test test test test test test test test test test junk",
			network: "unknownnet",
		} satisfies MidlNetworkConfig;

		expect(() => getBitcoinNetwork(config)).toThrowError(
			"Network unknownnet is not supported",
		);
	});
});
