import type { Config } from "~/createConfig";

export type GetRunesParams = {
  limit?: number;
  offset?: number;
  address: string;
};

export type GetRunesResponse = {
  limit: number;
  offset: number;
  total: number;
  results: {
    rune: {
      id: string;
      number: number;
      name: string;
      spaced_name: string;
    };
    balance: string;
    address: string;
  }[];
};

export const getRunes = async (
  config: Config,
  { address, limit, offset }: GetRunesParams
) => {
  if (!config.network) {
    throw new Error("No network found");
  }

  const url = new URL(
    `${config.network.runesUrl}/runes/v1/addresses/${address}/balances`
  );

  if (limit) {
    url.searchParams.set("limit", limit.toString());
  }

  if (offset) {
    url.searchParams.set("offset", offset.toString());
  }

  const data = await fetch(url.toString());

  const response = await data.json();

  return response;
};
