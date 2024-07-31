"use client";

import { createConfig, regtest, snap } from "@midl-xyz/midl-js-core";
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { HomePage } from "~/pages/HomePage";

const config = createConfig({
  chain: {
    chainId: 11155111,
    rpcUrls: ["https://rpc2.sepolia.org"],
  },
  networks: [regtest],
  persist: true,
  connectors: [snap()],
});

export default function Page() {
  return (
    <MidlProvider config={config}>
      <HomePage />
    </MidlProvider>
  );
}
