import type { Config } from "~/createConfig";

export const getBlockHeight = async (config: Config) => {
  if (!config.network) {
    throw new Error("No network");
  }

  const response = await fetch(`${config.network.rpcUrl}/blocks/tip/height`);
  const data = await response.text();

  return Number.parseInt(data, 10);
};
