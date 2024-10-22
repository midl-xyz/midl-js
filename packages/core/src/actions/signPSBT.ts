import { Psbt } from "bitcoinjs-lib";
import { broadcastTransaction } from "~/actions/broadcastTransaction";
import type { Config } from "~/createConfig";

export type SignPSBTParams = {
  psbt: string;
  signInputs: Record<string, number[]>;
  publish?: boolean;
  disableTweakSigner?: boolean;
};

export type SignPSBTResponse = {
  psbt: string;
  txId?: string;
};

export const signPSBT = async (
  config: Config,
  params: SignPSBTParams
): Promise<SignPSBTResponse> => {
  const { currentConnection } = config;

  if (!currentConnection) {
    throw new Error("No provider found");
  }

  const signedPSBT = await currentConnection.signPSBT(params);

  if (params.publish) {
    const psbt = Psbt.fromBase64(signedPSBT.psbt);

    psbt.finalizeAllInputs();

    const txId = await broadcastTransaction(
      config,
      psbt.extractTransaction().toHex()
    );

    return { psbt: psbt.toBase64(), txId };
  }

  return signedPSBT;
};
