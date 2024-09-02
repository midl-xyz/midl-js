import type { Config } from "~/createConfig";

export type GetRuneBalanceParams = {
  address: string;
  runeId: string;
};

export type GetRuneBalanceResponse = {
  address?: string;
  balance: string;
};

export const getRuneBalance = async (
  config: Config,
  { address, runeId }: GetRuneBalanceParams
) => {
  if (!config.network) {
    throw new Error("No network found");
  }

  const data = await fetch(
    `${config.network.runesUrl}/etchings/${runeId}/holders/${address}`
  );

  const response: GetRuneBalanceResponse = await data.json();

  return response;
};
