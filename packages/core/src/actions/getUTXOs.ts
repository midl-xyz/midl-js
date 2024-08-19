import type { Config } from "~/createConfig";

type UTXO = {
  readonly txid: string;
  readonly vout: number;
  readonly value: number;
  readonly address: string;
  readonly scriptPubKey: string;
  readonly blockHeight: number;
  readonly confirmations: number;
};

export const getUTXOs = async (
  config: Config,
  address: string
): Promise<UTXO[]> => {
  if (!config.network) {
    throw new Error("No network");
  }

  const data = await fetch(`${config.network.rpcUrl}/address/${address}/utxo`);
  const utxos = await data.json();

  return utxos as UTXO[];
};
