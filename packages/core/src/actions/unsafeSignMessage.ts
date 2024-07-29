import type { Config } from "~/createConfig";

export type UnsafeSignMessageParams = {
  message: string;
};

/**
 * Signs a message using the provided private key using the secp256k1 elliptic curve.
 */
export const unsafeSignMessage = async (
  config: Config,
  { message }: UnsafeSignMessageParams
) => {
  const ecc = await import("tiny-secp256k1");

  const buffer = Buffer.from(message, "hex");
  //   const { privateKey } = config;
  const privateKey = "";

  if (!privateKey) {
    throw new Error("Private key is required to sign a message.");
  }

  const privateKeyBuffer = Buffer.from(privateKey, "hex");

  const { signature, recoveryId } = ecc.signRecoverable(
    buffer,
    privateKeyBuffer
  );

  return {
    signature: Buffer.concat([signature, Buffer.from([recoveryId])]).toString(
      "hex"
    ),
    recoveryId: recoveryId,
  };
};
