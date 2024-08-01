import { keccak256, toHex } from "viem";
import { invoke } from "~/actions/invoke";
import type { Config } from "~/createConfig";

export type UnsafeSignMessageParams = {
  message: string;
};

export type UnsafeSignMessageResponse = {
  signature: string;
  recoveryId: number;
};

/**
 * Signs a message using the provided private key using the secp256k1 elliptic curve.
 */
export const unsafeSignMessage = (
  config: Config,
  { message }: UnsafeSignMessageParams
): Promise<UnsafeSignMessageResponse> => {
  return invoke<UnsafeSignMessageResponse>(config, {
    method: "unsafeSignMessage",
    params: {
      message: keccak256(toHex(message)).slice(2),
    },
  });
};
