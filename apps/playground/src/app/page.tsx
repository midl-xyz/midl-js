"use client";

import {
  createConfig,
  devnet,
  mainnet,
  satsConnect,
  leather,
  testnet,
  unisat,
} from "@midl-xyz/midl-js-core";
import { WagmiMidlProvider } from "@midl-xyz/midl-js-executor";
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { type Chain, http } from "viem";
import { WagmiProvider, createConfig as createWagmiConfig } from "wagmi";
import { Web3Provider } from "~/global";
import { HomePage } from "~/pages/HomePage";

const config = createConfig({
  chain: devnet,
  networks: [testnet, mainnet],
  persist: true,
  connectors: [leather(), unisat(), satsConnect()],
});

export default function Page() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <MidlProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider
          config={createWagmiConfig({
            chains: [devnet as Chain],
            transports: {
              [devnet.id]: http(devnet.rpcUrls.default.http[0]),
            },
          })}
        >
          <WagmiMidlProvider />
          <HomePage />
        </WagmiProvider>
      </QueryClientProvider>
    </MidlProvider>
  );
}
