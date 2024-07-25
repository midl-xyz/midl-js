import type { BitcoinNetwork } from "~/createConfig";

export const regtest: BitcoinNetwork = {
  network: "regtest",
  rpcUrl: "http://localhost:18443",
};
