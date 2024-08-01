// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { snap } from "~/connectors/snap";
import { AddressPurpose } from "~/constants";
import { regtest } from "~/networks";

describe("core | connectors | snap", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should use default snap target", () => {
    const createConnector = snap();
    const setState = vi.fn();
    const getState = vi.fn();

    const connector = createConnector({
      network: regtest,
      setState,
      getState,
    });

    expect(connector.id).toEqual("midlBTCSnap");
  });

  it("should connect to snap", async () => {
    const createConnector = snap();
    const publicKey = "0x1234567890";

    const setState = vi.fn();
    const getState = vi.fn().mockReturnValue({
      publicKey,
    });

    const connector = createConnector({
      network: regtest,
      setState,
      getState,
    });

    const promise = connector.connect({ purposes: [AddressPurpose.Payment] });

    const mockProvider = {
      request: vi.fn().mockImplementation(async params => {
        if (params.method === "wallet_requestSnaps") {
          return {
            "local:http://localhost:8080": {
              id: "local:http://localhost:8080",
              version: undefined,
            },
          };
        }

        return publicKey;
      }),
    };

    globalThis.dispatchEvent(
      new CustomEvent("eip6963:announceProvider", {
        detail: {
          info: {
            rdns: ["io.metamask.flask"],
          },
          provider: mockProvider,
        },
      })
    );

    vi.advanceTimersByTime(5000);

    await promise;

    expect(setState).toHaveBeenCalledWith({
      installedSnap: {
        id: "local:http://localhost:8080",
        version: undefined,
      },
      publicKey,
    });
  });
});
