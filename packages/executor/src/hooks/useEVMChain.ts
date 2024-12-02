import { useConfig } from "@midl-xyz/midl-js-react";
import { getEVMFromBitcoinNetwork } from "~/utils";

/**
 * Custom hook to retrieve the EVM chain associated with the current Bitcoin network.
 *
 * This hook maps the current Bitcoin network to its corresponding Ethereum Virtual Machine (EVM) chain configuration.
 *
 * @example
 * ```typescript
 * const evmChain = useEVMChain();
 * if (evmChain) {
 *   console.log(`EVM Chain Name: ${evmChain.name}`);
 * }
 * ```
 *
 * @returns {EVMChain | null} – The EVM chain configuration if available, otherwise `null`.
 */
export const useEVMChain = () => {
	const { network } = useConfig();

	return network ? getEVMFromBitcoinNetwork(network) : null;
};
