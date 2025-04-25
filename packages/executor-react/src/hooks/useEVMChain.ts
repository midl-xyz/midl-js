import { useConfig } from "@midl-xyz/midl-js-react";
import { getEVMFromBitcoinNetwork } from "@midl-xyz/midl-js-executor";

/**
 * Gets the EVM chain associated with the current Bitcoin network.
 *
 * @example
 * ```typescript
 * const evmChain = useEVMChain();
 * if (evmChain) {
 *   console.log(`EVM Chain Name: ${evmChain.name}`);
 * }
 * ```
 *
 * @returns The EVM chain configuration if available, otherwise `null`.
 */
export const useEVMChain = () => {
	const { network } = useConfig();

	return network ? getEVMFromBitcoinNetwork(network) : null;
};
