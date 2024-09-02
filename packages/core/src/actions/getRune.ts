import type { Config } from "~/createConfig";

export type GetRuneResponse = {
  id: string;
  name: string;
  spaced_name: string;
  number: number;
  divisibility: number;
  symbol: string;
  turbo: boolean;
  mint_terms: {
    amount: number | null;
    cap: number | null;
    height_start: number | null;
    height_end: number | null;
    offset_start: number | null;
    offset_end: number | null;
  };
  supply: {
    current: string;
    minted: string;
    total_mints: string;
    mint_percentage: string;
    mintable: boolean;
    burned: string;
    total_burns: string;
    premine: string;
  };
  location: {
    block_hash: string;
    block_height: number;
    tx_id: string;
    tx_index: number;
    timestamp: number;
  };
};

export const getRune = async (config: Config, runeId: string) => {
  if (!config.network) {
    throw new Error("No network found");
  }

  const data = await fetch(`${config.network.runesUrl}/etchings/${runeId}`);

  const response: GetRuneResponse = await data.json();

  return response;
};
