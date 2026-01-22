import {
	type AbstractProvider,
	type AbstractRunesProvider,
	AddressPurpose,
	AddressType,
	type Connector,
	type ConnectorWithMetadata,
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

	describe("payment address type", () => {
		it("uses custom paymentAddressType when provided", async () => {
			const store = createStore();
			const userConfig = {
				mnemonic: "test test test test test test test test test test test junk",
				paymentAddressType: AddressType.P2SH_P2WPKH,
			} satisfies MidlNetworkConfig;

			await setup(userConfig, store, {
				bitcoinNetwork: regtest,
				accountIndex: 0,
			});

			expect(keyPairConnector).toHaveBeenCalledWith({
				mnemonic: "test test test test test test test test test test test junk",
				paymentAddressType: AddressType.P2SH_P2WPKH,
				accountIndex: 0,
			});
		});

		it("defaults to P2WPKH when paymentAddressType is not provided", async () => {
			const store = createStore();
			const userConfig = {
				mnemonic: "test test test test test test test test test test test junk",
			} satisfies MidlNetworkConfig;

			await setup(userConfig, store, {
				bitcoinNetwork: regtest,
			});

			expect(keyPairConnector).toHaveBeenCalledWith({
				mnemonic: "test test test test test test test test test test test junk",
				paymentAddressType: AddressType.P2WPKH,
				accountIndex: 0,
			});
		});
	});

	describe("private keys support", () => {
		it("creates connector with private keys instead of mnemonic", async () => {
			const store = createStore();
			const userConfig = {
				privateKeys: ["cSBTc78h1Ab9MNcQcFD8w3kNTW8xWM4EjTQgKLDq9gUG9GrRZD3f"],
			} satisfies MidlNetworkConfig;

			await setup(userConfig, store, {
				bitcoinNetwork: regtest,
				accountIndex: 0,
			});

			expect(keyPairConnector).toHaveBeenCalledWith({
				privateKeys: ["cSBTc78h1Ab9MNcQcFD8w3kNTW8xWM4EjTQgKLDq9gUG9GrRZD3f"],
				paymentAddressType: AddressType.P2WPKH,
				accountIndex: 0,
			});
		});

		it("works with custom paymentAddressType and private keys", async () => {
			const store = createStore();
			const userConfig = {
				privateKeys: ["cSBTc78h1Ab9MNcQcFD8w3kNTW8xWM4EjTQgKLDq9gUG9GrRZD3f"],
				paymentAddressType: AddressType.P2SH_P2WPKH,
			} satisfies MidlNetworkConfig;

			await setup(userConfig, store, {
				bitcoinNetwork: regtest,
				accountIndex: 1,
			});

			expect(keyPairConnector).toHaveBeenCalledWith({
				privateKeys: ["cSBTc78h1Ab9MNcQcFD8w3kNTW8xWM4EjTQgKLDq9gUG9GrRZD3f"],
				paymentAddressType: AddressType.P2SH_P2WPKH,
				accountIndex: 1,
			});
		});
	});

	describe("custom connector factory", () => {
		it("uses custom connectorFactory when provided", async () => {
			const store = createStore();
			const mockConnector = {
				id: "custom-connector",
				connect: vi.fn(),
				signMessage: vi.fn(),
				signPSBT: vi.fn(),
			} as unknown as ConnectorWithMetadata<Connector>;
			const connectorFactory = vi.fn(() => mockConnector);

			const userConfig = {
				connectorFactory,
			} satisfies MidlNetworkConfig;

			await setup(userConfig, store, {
				bitcoinNetwork: regtest,
				accountIndex: 2,
			});

			expect(connectorFactory).toHaveBeenCalledWith({
				accountIndex: 2,
				paymentAddressType: AddressType.P2WPKH,
			});

			expect(createConfig).toHaveBeenCalledWith(
				expect.objectContaining({
					connectors: [mockConnector],
				}),
			);
		});

		it("passes custom paymentAddressType to connectorFactory", async () => {
			const store = createStore();
			const mockConnector = {
				id: "custom-connector",
				connect: vi.fn(),
				signMessage: vi.fn(),
				signPSBT: vi.fn(),
			} as unknown as ConnectorWithMetadata<Connector>;
			const connectorFactory = vi.fn(() => mockConnector);

			const userConfig = {
				connectorFactory,
				paymentAddressType: AddressType.P2SH_P2WPKH,
			} satisfies MidlNetworkConfig;

			await setup(userConfig, store, {
				bitcoinNetwork: regtest,
				accountIndex: 3,
			});

			expect(connectorFactory).toHaveBeenCalledWith({
				accountIndex: 3,
				paymentAddressType: AddressType.P2SH_P2WPKH,
			});
		});

		it("does not call keyPairConnector when connectorFactory is provided", async () => {
			const store = createStore();
			const mockConnector = {
				id: "custom-connector",
				connect: vi.fn(),
				signMessage: vi.fn(),
				signPSBT: vi.fn(),
			} as unknown as ConnectorWithMetadata<Connector>;
			const connectorFactory = vi.fn(() => mockConnector);

			const userConfig = {
				connectorFactory,
			} satisfies MidlNetworkConfig;

			await setup(userConfig, store, {
				bitcoinNetwork: regtest,
			});

			expect(keyPairConnector).not.toHaveBeenCalled();
			expect(connectorFactory).toHaveBeenCalled();
		});
	});
});
