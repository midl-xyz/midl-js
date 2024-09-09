import type { Config } from "~/createConfig";

export type RuneUTXO = {
  height: number;
  address: string;
  txid: string;
  vout: number;
  satoshis: number;
  scriptPk: string;
  runes: {
    rune: string;
    runeId: string;
    spacedRune: string;
    amount: string;
    symbol: string;
    divisibility: number;
  }[];
};

export const getRuneUTXO = async (
  config: Config,
  address: string,
  runeId: string
) => {
  if (!config.network) {
    throw new Error("No network");
  }

  const data = await fetch(
    `${config.network.runesUrl}/utxos/${address}/?runeId=${runeId}`
  );
  const utxos = await data.json();

  return utxos?.data?.utxo as RuneUTXO[];
};
