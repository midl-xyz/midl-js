import type { Config } from "~/createConfig";

export type InvokeParams = {
  method: string;
  params: Record<string, unknown>;
};

export const invoke = async <T = unknown>(
  config: Config,
  params: InvokeParams
): Promise<T> => {
  const { currentConnection } = config;

  if (!currentConnection) {
    throw new Error("No provider found");
  }

  const configState = config.getState();

  if (currentConnection.type === "snap") {
    return currentConnection?.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: configState.installedSnap?.id,
        request: {
          ...params,
        },
      },
    }) as T;
  }

  return currentConnection?.request({
    method: params.method,
    params: {
      ...params.params,
    },
  }) as T;
};
