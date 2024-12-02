import { useAccounts, useConfig } from "@midl-xyz/midl-js-react";
import { zeroAddress } from "viem";
import type { Address } from "viem/accounts";
import { usePublicKey } from "~/hooks/usePublicKey";
import { getEVMAddress } from "~/utils/getEVMAddress";

type UseEVMAddressParams = {
	/**
	 * The public key to get the EVM address from
	 */
	publicKey?: Address;
};

/**
 * Hook to get the EVM address from the public key
 *
 * If the public key is not provided, it will try to get it from the payment account or the ordinals account
 * If the public key is not found, it will return the zero address
 *
 * @param publicKey The public key to get the EVM address from
 * @returns The EVM address
 */
export const useEVMAddress = ({ publicKey }: UseEVMAddressParams = {}) => {
	const { ordinalsAccount, paymentAccount } = useAccounts();
	const config = useConfig();
	const pk = usePublicKey({
		publicKey:
			publicKey ??
			(paymentAccount?.publicKey as `0x${string}`) ??
			(ordinalsAccount?.publicKey as `0x${string}`),
	});

	try {
		if (!pk || !config.network) {
			return zeroAddress;
		}

		return getEVMAddress(pk);
	} catch (e) {
		return zeroAddress;
	}
};
