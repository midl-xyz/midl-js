import { useAccounts, useConfig } from "@midl-xyz/midl-js-react";
import { zeroAddress } from "viem";
import { usePublicKey } from "~/hooks/usePublicKey";
import { getEVMAddress } from "~/utils/getEVMAddress";

type UseEVMAddressParams = {
	/**
	 * The public key to get the EVM address from
	 */
	publicKey?: string;
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
 */
export const useEVMAddress = ({ publicKey }: UseEVMAddressParams = {}) => {
	const config = useConfig();
	const pk = usePublicKey({
		publicKey,
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
