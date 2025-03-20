// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { type BitcoinNetwork, createConfig } from "~/createConfig";
import { regtest } from "~/networks";

describe("core | createConfig", () => {
	it("should create a config", () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
		});

		expect(config.getState().network).toEqual(regtest);
	});

	it("should set the network", () => {
		const mockNetwork: BitcoinNetwork = {
			network: "testnet",
			rpcUrl: "http://localhost:183",
			runesUrl: "http://localhost:183",
		} as BitcoinNetwork;

		const config = createConfig({
			networks: [regtest, mockNetwork],
			connectors: [],
		});

		config.setState({ network: mockNetwork });

		expect(config.getState().network).toEqual(mockNetwork);
	});

	it("should subscribe to changes", () => {
		const mockNetwork: BitcoinNetwork = {
			network: "testnet",
			rpcUrl: "http://localhost:183",
			runesUrl: "http://localhost:183",
		} as BitcoinNetwork;

		const config = createConfig({
			networks: [regtest, mockNetwork],
			connectors: [],
		});

		const callback = vi.fn();

		config.subscribe(callback);

		config.setState({ network: mockNetwork });

		expect(callback).toHaveBeenCalledOnce();
		expect(config.getState().network).toEqual(mockNetwork);
	});

	it("should persist the state", () => {
		const setItem = vi.spyOn(Storage.prototype, "setItem");

		const config = createConfig({
			networks: [regtest],
			connectors: [],
			persist: true,
		});

		const mockNetwork: BitcoinNetwork = {
			network: "testnet",
			rpcUrl: "http://localhost:183",
			runesUrl: "http://localhost:183",
		} as BitcoinNetwork;

		config.setState({ network: mockNetwork });

		expect(setItem).toHaveBeenCalled();

		setItem.mockClear();
	});
});
