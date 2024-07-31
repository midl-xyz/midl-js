import type { Config } from "~/createConfig";

export type InvokeSnapParams = {
  method: string;
  params: Record<string, unknown>;
};

export const invokeSnap = async <T>(
  config: Config,
  params: InvokeSnapParams
) => {
  const provider = await config.currentConnection?.provider();

  if (!provider) {
    throw new Error("No provider found");
  }

  return provider?.request({
    method: "wallet_invokeSnap",
    params: {
      snapId: config.getState().installedSnap?.id,
      request: {
        ...params,
      },
    },
  });
};
