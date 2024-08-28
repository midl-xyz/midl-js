import type { Config } from "~/createConfig";

export const broadcastTransaction = async (
  config: Config,
  txHex: string
): Promise<string> => {
  if (!config.network) {
    throw new Error("No network");
  }

  const data = await fetch(`${config.network.rpcUrl}/tx`, {
    method: "POST",
    body: txHex,
  });

  const txid = await data.text();

  return txid as string;
};
