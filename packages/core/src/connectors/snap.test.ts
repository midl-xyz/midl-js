// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { snap } from "~/connectors/snap";
import { regtest } from "~/networks";

describe("core | connectors | snap", () => {
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
    const setState = vi.fn();
    const getState = vi.fn();

    const connector = createConnector({
      network: regtest,
      setState,
      getState,
    });

    const promise = connector.connect();

    const mockProvider = {
      request: vi.fn().mockReturnValue({
        id: "local:http://localhost:8080",
        version: undefined,
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

    await promise;

    expect(setState).toHaveBeenCalledWith({
      installedSnap: {
        id: "local:http://localhost:8080",
        version: undefined,
      },
    });
  });
});
