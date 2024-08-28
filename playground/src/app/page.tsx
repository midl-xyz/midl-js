"use client";

import {
  createConfig,
  devnet,
  mainnet,
  satsConnect,
  testnet,
  unisat,
} from "@midl-xyz/midl-js-core";
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { HomePage } from "~/pages/HomePage";

const config = createConfig({
  chain: devnet,
  networks: [testnet, mainnet],
  persist: true,
  connectors: [unisat(), satsConnect()],
});

export default function Page() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <MidlProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <HomePage />
      </QueryClientProvider>
    </MidlProvider>
  );
}
