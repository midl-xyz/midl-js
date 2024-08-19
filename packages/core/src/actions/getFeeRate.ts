import type { Config } from "~/createConfig";

type FeeRate = {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
};

export const getFeeRate = async (config: Config): Promise<FeeRate> => {
  if (!config.network) {
    throw new Error("No network");
  }

  const data = await fetch(`${config.network.rpcUrl}/fees/recommended`);
  return data.json();
};
