// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { discoverSnapsProvider } from "~/connectors/discoverSnapsProvider";

describe("core | connectors | discoverSnapsProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should not discover snaps after 5s", async () => {
    const promise = discoverSnapsProvider();

    vi.advanceTimersByTime(5000);

    expect(promise).rejects.toThrow("Provider not found");
  });

  it("should discover snaps", async () => {
    const promise = discoverSnapsProvider();

    expect(vi.getTimerCount()).toBe(1);

    globalThis.dispatchEvent(
      new CustomEvent("eip6963:announceProvider", {
        detail: {
          info: {
            rdns: ["io.metamask.flask"],
          },
          provider: "metamask",
        },
      })
    );

    vi.advanceTimersByTime(5000);
    expect(vi.getTimerCount()).toBe(0);

    expect(promise).resolves.toEqual("metamask");
  });
});
