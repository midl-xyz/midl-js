import { regtest } from "@midl/core";
import { SystemContracts, getEVMFromBitcoinNetwork } from "@midl/executor";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { describe, expect, it } from "vitest";
import type { MidlNetworkConfig } from "~/type-extensions";

import { getChain } from "./getChain";

const makeHre = (networks: Record<string, unknown> = {}) =>
	({
		config: {
			networks,
		},
	}) as unknown as HardhatRuntimeEnvironment;

describe("getChain", () => {
	it("returns getEVMFromBitcoinNetwork when hardhatNetwork is not set", () => {
		const userConfig = {
			mnemonic: "test test test test test test test test test test test junk",
			network: regtest,
		} satisfies MidlNetworkConfig;

		const expected = getEVMFromBitcoinNetwork(regtest);
		expect(getChain(userConfig, makeHre())).toEqual(expected);
	});

	it("returns a custom Chain from hardhat network config", () => {
		const hre = makeHre({
			mynet: {
				chainId: 1337,
				url: "http://127.0.0.1:8545",
			},
		});

		const userConfig = {
			mnemonic: "test test test test test test test test test test test junk",
			hardhatNetwork: "mynet",
		} satisfies MidlNetworkConfig;

		const chain = getChain(userConfig, hre);

		expect(chain.id).toBe(1337);
		expect(chain.name).toBe("MIDL");
		expect(chain.nativeCurrency).toEqual({
			name: "Bitcoin",
			symbol: "BTC",
			decimals: 18,
		});
		expect(chain.rpcUrls.default.http).toEqual(["http://127.0.0.1:8545"]);
		expect(chain.contracts?.multicall3?.address).toBe(
			SystemContracts.Multicall3,
		);
	});

	it("throws when hardhat network does not define chainId", () => {
		const hre = makeHre({
			mynet: {
				url: "http://127.0.0.1:8545",
			},
		});

		const userConfig = {
			mnemonic: "test test test test test test test test test test test junk",
			hardhatNetwork: "mynet",
		} satisfies MidlNetworkConfig;

		expect(() => getChain(userConfig, hre)).toThrowError(
			"Hardhat network mynet does not have chainId defined",
		);
	});

	it("throws when hardhat network does not define url", () => {
		const hre = makeHre({
			mynet: {
				chainId: 1337,
			},
		});

		const userConfig = {
			mnemonic: "test test test test test test test test test test test junk",
			hardhatNetwork: "mynet",
		} satisfies MidlNetworkConfig;

		expect(() => getChain(userConfig, hre)).toThrowError(
			"Hardhat network mynet does not have url defined",
		);
	});
});
