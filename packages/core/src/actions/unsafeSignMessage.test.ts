import { describe, expect, it } from "vitest";
import { unsafeSignMessage } from "./unsafeSignMessage";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";

describe("core | actions | unsafeSignMessage", () => {
  it.skip("should sign a message", async () => {
    const config = createConfig({
      networks: [regtest],
      chain: {
        chainId: 1,
        rpcUrls: ["http://localhost:8545"],
      },
      connectors: [],
    });

    const result = await unsafeSignMessage(config, { message: "Hello World!" });
    expect(result).toEqual("Hello World!");
  });
});
