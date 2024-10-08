"use client";

import { devnet } from "@midl-xyz/midl-js-core";
import { useEVMAddress } from "@midl-xyz/midl-js-executor";
import { useMemo, type ReactNode } from "react";
import type { Chain } from "viem";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mock } from "wagmi/connectors";

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const evmAddress = useEVMAddress();

  const config = useMemo(
    () =>
      createConfig({
        connectors: [
          mock({
            accounts: [evmAddress],
            reconnect: true,
          }),
        ],
        chains: [devnet as Chain],
        transports: {
          [devnet.id]: http(devnet.rpcUrls.default.http[0]),
        },
      }),
    [evmAddress]
  );

  return <WagmiProvider config={config}>{children}</WagmiProvider>;
};
