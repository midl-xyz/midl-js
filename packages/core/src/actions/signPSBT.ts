import type { Config } from "~/createConfig";

export type SignPSBTParams = {
  psbt: string;
  key: string;
};

export type SignPSBTResponse = {
  psbt: string;
};

export const signPSBT = (
  config: Config,
  params: SignPSBTParams
): Promise<SignPSBTResponse> => {
  const { currentConnection } = config;

  if (!currentConnection) {
    throw new Error("No provider found");
  }

  return currentConnection.signPSBT(params);
};
