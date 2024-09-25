import { type Address, pad, toHex } from "viem";

export const runeIdToBytes32 = (runeId: string): Address => {
  const [blockHeight = "0", txIndex = "0"] = runeId.split(":");

  let bytes32RuneId: Address = pad("0x0", { size: 32 });

  try {
    bytes32RuneId = pad(
      toHex((BigInt(blockHeight) << BigInt(32)) | BigInt(txIndex)),
      { size: 32 }
    );
  } catch (e) {
    // do nothing
  }

  return bytes32RuneId;
};
