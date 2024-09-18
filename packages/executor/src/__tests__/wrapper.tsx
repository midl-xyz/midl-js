import {
  createConfig,
  devnet,
  satsConnect,
  testnet,
} from "@midl-xyz/midl-js-core";
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "~/__tests__/wagmiConfig";

const queryClient = new QueryClient();

const config = createConfig({
  networks: [testnet],
  chain: devnet,
  connectors: [satsConnect()],
});

export const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <MidlProvider config={config}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </MidlProvider>
  );
};
