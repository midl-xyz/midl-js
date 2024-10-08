import { useAccounts } from "@midl-xyz/midl-js-react";
import { type Address, publicKeyToAddress } from "viem/accounts";
import { ProjectivePoint } from "@noble/secp256k1";
import { toHex, zeroAddress } from "viem";

type UseEVMAddressParams = {
  publicKey?: Address;
};

export const useEVMAddress = ({ publicKey }: UseEVMAddressParams = {}) => {
  const { paymentAccount, ordinalsAccount } = useAccounts();

  try {
    const pk =
      publicKey ?? paymentAccount?.publicKey ?? ordinalsAccount?.publicKey;

    const point = ProjectivePoint.fromHex(pk as `0x${string}`); // `0x${string}` is a type assertion

    const uncompressedPublicKeyHex = toHex(
      point.toRawBytes(false) // false means we want the uncompressed public key
    );

    const evmAddress = publicKeyToAddress(
      publicKey ?? ((`${uncompressedPublicKeyHex}` ?? "") as Address)
    );

    return evmAddress;
  } catch (e) {
    return zeroAddress;
  }
};
