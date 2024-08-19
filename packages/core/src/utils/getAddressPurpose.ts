import { AddressPurpose } from "~/constants";
import type { BitcoinNetwork } from "~/createConfig";
import { isCorrectAddress } from "~/utils/isCorrectAddress";

export const getAddressPurpose = (
  address: string,
  network: BitcoinNetwork
): AddressPurpose => {
  if (!isCorrectAddress(address, network)) {
    throw new Error("Incorrect network");
  }

  switch (network.network) {
    case "bitcoin":
      if (address.startsWith("3")) {
        return AddressPurpose.Payment;
      }

      if (address.startsWith("bc1p")) {
        return AddressPurpose.Ordinals;
      }

      throw new Error("Unknown address type");

    case "testnet":
      if (address.startsWith("2")) {
        return AddressPurpose.Payment;
      }

      if (address.startsWith("tb1p")) {
        return AddressPurpose.Ordinals;
      }

      throw new Error("Unknown address type");

    case "regtest":
      if (address.startsWith("2")) {
        return AddressPurpose.Payment;
      }

      if (address.startsWith("bcrt1p")) {
        return AddressPurpose.Ordinals;
      }

      throw new Error("Unknown address type");
  }
};
