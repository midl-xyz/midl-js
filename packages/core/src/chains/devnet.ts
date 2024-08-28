import type { Chain } from "~/types/chain";

export const devnet: Chain = {
  id: 0x309,
  rpcUrls: {
    default: {
      http: ["https://rpc-dev.midl.xyz"],
    },
  },
  name: "midl",
  nativeCurrency: {
    name: "MIDL",
    symbol: "MIDL",
    decimals: 18,
  },
};
