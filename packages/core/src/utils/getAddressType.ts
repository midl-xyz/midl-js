import { AddressType } from "~/constants";

export const getAddressType = (address: string): AddressType => {
  if (address.startsWith("3") || address.startsWith("2")) {
    return AddressType.P2SH;
  }

  if (
    address.startsWith("bc1p") ||
    address.startsWith("tb1p") ||
    address.startsWith("bcrt1p")
  ) {
    return AddressType.P2TR;
  }

  if (
    address.startsWith("bc1q") ||
    address.startsWith("tb1q") ||
    address.startsWith("bcrt1q")
  ) {
    return AddressType.P2WPKH;
  }

  throw new Error("Unknown address type");
};
