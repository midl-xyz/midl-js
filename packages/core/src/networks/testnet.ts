import type { BitcoinNetwork } from "~/createConfig";

export const testnet: BitcoinNetwork = {
  id: "testnet",
  network: "testnet",
  rpcUrl: "https://mempool.space/testnet/api",
  runesUrl: "https://idxv3.midl.xyz",
};
