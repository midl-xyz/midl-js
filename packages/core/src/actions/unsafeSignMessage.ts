import { keccak256, toHex } from "viem";
import { invokeSnap } from "~/actions/invokeSnap";
import type { Config } from "~/createConfig";

export type UnsafeSignMessageParams = {
  message: string;
};

/**
 * Signs a message using the provided private key using the secp256k1 elliptic curve.
 */
export const unsafeSignMessage = (
  config: Config,
  { message }: UnsafeSignMessageParams
) => {
  return invokeSnap<{ signature: string; recoveryId: number }>(config, {
    method: "signMessage",
    params: {
      message: keccak256(toHex(message)).slice(2),
    },
  });
};
