import type { BitcoinNetwork } from "~/createConfig";

export const mainnet: BitcoinNetwork = {
  id: "mainnet",
  network: "bitcoin",
  rpcUrl: "https://mempool.space/api/v1",
  runesUrl: "https://api.unisat.io/query-v4",
};
