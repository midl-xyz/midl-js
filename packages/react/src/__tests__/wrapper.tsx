import type { ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MidlProvider } from "../context";
import { createConfig, satsConnect, testnet } from "@midl-xyz/midl-js-core";

const queryClient = new QueryClient();

const config = createConfig({
  networks: [testnet],
//   chain: {
//     id: 11155111,
//     rpcUrls: {
//       default: {
//         http: ["https://rpc2.sepolia.org"],
//       },
//     },
//   },
  connectors: [satsConnect()],
});

export const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <MidlProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MidlProvider>
  );
};
