import { useAccounts } from "@midl-xyz/midl-js-react";
import { zeroAddress } from "viem";
import type { Address } from "viem/accounts";
import { getEVMAddress } from "~/utils/getEVMAddress";

type UseEVMAddressParams = {
  publicKey?: Address;
};

export const useEVMAddress = ({ publicKey }: UseEVMAddressParams = {}) => {
  const { ordinalsAccount, paymentAccount } = useAccounts();

  try {
    const pk =
      publicKey ?? paymentAccount?.publicKey ?? ordinalsAccount?.publicKey;

    if (!pk) {
      return zeroAddress;
    }

    return getEVMAddress(`0x${pk}`);
  } catch (e) {
    return zeroAddress;
  }
};
