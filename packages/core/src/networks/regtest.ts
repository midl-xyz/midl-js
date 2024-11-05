import type { BitcoinNetwork } from "~/createConfig";

export const regtest: BitcoinNetwork = {
  id: "regtest",
  network: "regtest",
  rpcUrl: "http://localhost:18443",
  runesUrl: "http://localhost:18444",
  explorerUrl: "http://localhost:8080",
};
