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
 * Custom hook to retrieve the EVM address corresponding to a given public key.
 *
 * This hook converts a Bitcoin public key to its corresponding Ethereum Virtual Machine (EVM) address.
 * If no public key is provided, it uses the connected payment or ordinals account's public key.
 *
 * @example
 * ```typescript
 * const evmAddress = useEVMAddress({ publicKey: '0xabc123...' });
 * ```
 *
 * @param {UseEVMAddressParams} [params] - Parameters for retrieving the EVM address.
 * @param {Address} [params.publicKey] - The public key to convert to an EVM address.
 *
 * @returns {Address} – The corresponding EVM address, or the zero address if unavailable.
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
