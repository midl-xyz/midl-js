import {
	type AbstractProvider,
	type AbstractRunesProvider,
	AddressPurpose,
	AddressType,
	connect,
	createConfig,
	regtest,
} from "@midl/core";
import { keyPairConnector } from "@midl/node";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "~/actions/createStore";
import type { MidlNetworkConfig } from "~/type-extensions";

import { setup } from "./setup";

vi.mock("@midl/core", async () => {
	const actual =
		await vi.importActual<typeof import("@midl/core")>("@midl/core");
	return {
		...actual,
		connect: vi.fn().mockResolvedValue(undefined),
		createConfig: vi.fn((config) => {
			return actual.createConfig(config);
		}),
	};
});

vi.mock("@midl/node", async () => {
	const actual = await vi.importActual("@midl/node");
	return {
		...actual,
		keyPairConnector: vi.fn((config) => config),
	};
});

describe("setup", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("creates config with correct parameters and updates store state", async () => {
		const store = createStore();
		const userConfig = {
			mnemonic: "test test test test test test test test test test test junk",
		} satisfies MidlNetworkConfig;

		await setup(userConfig, store, {
			bitcoinNetwork: regtest,
			accountIndex: 0,
		});

		expect(createConfig).toHaveBeenCalledWith({
			networks: [regtest],
			connectors: [
				{
					mnemonic:
						"test test test test test test test test test test test junk",
					paymentAddressType: AddressType.P2WPKH,
					accountIndex: 0,
				},
			],
			defaultPurpose: undefined,
			runesProvider: undefined,
			provider: undefined,
		});

		const state = store.getState();
		expect(state.intentions).toEqual([]);
	});

	it("uses custom accountIndex when provided", async () => {
		const store = createStore();
		const userConfig = {
			mnemonic: "test test test test test test test test test test test junk",
		} satisfies MidlNetworkConfig;

		await setup(userConfig, store, {
			bitcoinNetwork: regtest,
			accountIndex: 5,
		});

		expect(keyPairConnector).toHaveBeenCalledWith({
			mnemonic: "test test test test test test test test test test test junk",
			paymentAddressType: AddressType.P2WPKH,
			accountIndex: 5,
		});
	});

	it("passes through defaultPurpose from userConfig", async () => {
		const store = createStore();
		const userConfig = {
			mnemonic: "test test test test test test test test test test test junk",
			defaultPurpose: AddressPurpose.Ordinals,
		} satisfies MidlNetworkConfig;

		await setup(userConfig, store, {
			bitcoinNetwork: regtest,
		});

		expect(createConfig).toHaveBeenCalledWith(
			expect.objectContaining({
				defaultPurpose: AddressPurpose.Ordinals,
			}),
		);
	});

	it("passes through runesProvider from userConfig", async () => {
		const store = createStore();
		const mockRunesProvider = {} as AbstractRunesProvider;
		const userConfig = {
			mnemonic: "test test test test test test test test test test test junk",
			runesProviderFactory: () => mockRunesProvider,
		} satisfies MidlNetworkConfig;

		await setup(userConfig, store, {
			bitcoinNetwork: regtest,
		});

		expect(createConfig).toHaveBeenCalledWith(
			expect.objectContaining({
				runesProvider: mockRunesProvider,
			}),
		);
	});

	it("passes through provider from userConfig", async () => {
		const store = createStore();
		const mockProvider = {} as AbstractProvider;
		const userConfig = {
			mnemonic: "test test test test test test test test test test test junk",
			providerFactory: () => mockProvider,
		} satisfies MidlNetworkConfig;

		await setup(userConfig, store, {
			bitcoinNetwork: regtest,
		});

		expect(createConfig).toHaveBeenCalledWith(
			expect.objectContaining({
				provider: mockProvider,
			}),
		);
	});

	it("calls connect with Payment and Ordinals purposes", async () => {
		const store = createStore();
		const userConfig = {
			mnemonic: "test test test test test test test test test test test junk",
		} satisfies MidlNetworkConfig;

		const mockConfig = { networks: [regtest] };
		vi.mocked(createConfig).mockReturnValueOnce(
			mockConfig as unknown as ReturnType<typeof createConfig>,
		);

		await setup(userConfig, store, {
			bitcoinNetwork: regtest,
		});

		expect(connect).toHaveBeenCalledWith(mockConfig, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});
	});

	it("initializes store with empty intentions array", async () => {
		const store = createStore();
		const userConfig = {
			mnemonic: "test test test test test test test test test test test junk",
		} satisfies MidlNetworkConfig;

		await setup(userConfig, store, {
			bitcoinNetwork: regtest,
		});

		const state = store.getState();
		expect(state.intentions).toEqual([]);
	});

	it("returns the created Midl config", async () => {
		const store = createStore();
		const userConfig = {
			mnemonic: "test test test test test test test test test test test junk",
		} satisfies MidlNetworkConfig;

		const config = await setup(userConfig, store, {
			bitcoinNetwork: regtest,
		});

		expect(config).toBeDefined();
		expect(config.getState().networks).toContain(regtest);
	});
});
