// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { type BitcoinNetwork, createConfig } from "~/createConfig";
import { regtest } from "~/networks";

describe("core | createConfig", () => {
  it("should create a config", () => {
    const config = createConfig({
      networks: [regtest],
      chain: {
        id: 1,
        rpcUrls: {
          default: {
            http: ["http://localhost:8545"],
          },
        },
      },
      connectors: [],
    });

    expect(config.network).toEqual(regtest);
  });

  it("should set the network", () => {
    const mockNetwork: BitcoinNetwork = {
      network: "testnet",
      rpcUrl: "http://localhost:183",
      runesUrl: "http://localhost:183",
    };

    const config = createConfig({
      networks: [regtest, mockNetwork],
      chain: {
        id: 1,
        rpcUrls: {
          default: {
            http: ["http://localhost:8545"],
          },
        },
      },
      connectors: [],
    });

    config.setState({ network: mockNetwork });

    expect(config.network).toEqual(mockNetwork);
  });

  it("should subscribe to changes", () => {
    const mockNetwork: BitcoinNetwork = {
      network: "testnet",
      rpcUrl: "http://localhost:183",
      runesUrl: "http://localhost:183",
    };

    const config = createConfig({
      networks: [regtest, mockNetwork],
      chain: {
        id: 1,
        rpcUrls: {
          default: {
            http: ["http://localhost:8545"],
          },
        },
      },
      connectors: [],
    });

    const callback = vi.fn();

    config.subscribe(callback);

    config.setState({ network: mockNetwork });

    expect(callback).toHaveBeenCalledWith({ network: mockNetwork });
  });

  it("should persist the state", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    const config = createConfig({
      networks: [regtest],
      chain: {
        id: 1,
        rpcUrls: {
          default: {
            http: ["http://localhost:8545"],
          },
        },
      },
      connectors: [],
      persist: true,
    });

    const mockNetwork: BitcoinNetwork = {
      network: "testnet",
      rpcUrl: "http://localhost:183",
      runesUrl: "http://localhost:183",
    };

    config.setState({ network: mockNetwork });

    expect(setItem).toHaveBeenCalledWith(
      "midl-js",
      JSON.stringify({ network: mockNetwork })
    );

    setItem.mockClear();
  });
});
