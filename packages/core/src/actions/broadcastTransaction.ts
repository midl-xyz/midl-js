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
    headers: {
      "Content-Type": "application/json",
    },
  });

  const txid = await data.json();

  return txid as string;
};
