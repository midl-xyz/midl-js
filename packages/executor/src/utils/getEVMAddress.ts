import { getAddress, keccak256, toHex } from "viem";

export const getEVMAddress = (publicKey: `0x${string}`) => {
  const publicKeyBuffer = Buffer.from(publicKey.slice(2), "hex");

  const address = Buffer.from(
    keccak256(Uint8Array.from(publicKeyBuffer)).slice(2),
    "hex"
  ).slice(-20);

  return getAddress(toHex(address));
};
