import type { Config } from "~/createConfig";

export type GetFeeRateResponse = {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
};

export const getFeeRate = async (
  config: Config
): Promise<GetFeeRateResponse> => {
  if (!config.network) {
    throw new Error("No network");
  }

  const data = await fetch(`${config.network.rpcUrl}/v1/fees/recommended`);
  return data.json();
};
