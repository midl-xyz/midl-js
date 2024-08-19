"use client";

import {
  createConfig,
  mainnet,
  satsConnect,
  testnet,
  unisat,
} from "@midl-xyz/midl-js-core";
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { HomePage } from "~/pages/HomePage";

const config = createConfig({
  chain: {
    chainId: 11155111,
    rpcUrls: ["https://rpc2.sepolia.org"],
  },
  networks: [testnet, mainnet],
  persist: true,
  connectors: [unisat(), satsConnect()],
});

export default function Page() {
  return (
    <MidlProvider config={config}>
      <HomePage />
    </MidlProvider>
  );
}
