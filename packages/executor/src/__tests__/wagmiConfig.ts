import { devnet } from "@midl-xyz/midl-js-core";
import type { Chain } from "viem";
import { createConfig, http } from "wagmi";
import { mock } from "@wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [devnet as Chain],
  transports: {
    [devnet.id]: http(devnet.rpcUrls.default.http[0]),
  },
  connectors: [
    mock({
      accounts: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
    }),
  ],
});
