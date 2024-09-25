import type { Address } from "viem";

export const bytes32toRuneId = (bytes32RuneId: Address) => {
  const blockHeight = BigInt(bytes32RuneId) >> BigInt(32);
  const txIndex = BigInt(bytes32RuneId) & BigInt(0xffffffff);

  return `${blockHeight}:${txIndex}`;
};
