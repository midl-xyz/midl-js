import { useConfig } from "@midl-xyz/midl-js-react";
import {
	type Chain,
	getEVMFromBitcoinNetwork,
} from "@midl-xyz/midl-js-executor";
import type { Config } from "@midl-xyz/midl-js-core";

type UseEVMChainParams = {
	config?: Config;
	chain?: Chain;
};

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
export const useEVMChain = ({
	config: customConfig,
	chain: customChain,
}: UseEVMChainParams = {}) => {
	const { network } = useConfig(customConfig);

	if (customChain) {
		return customChain;
	}

	return network ? getEVMFromBitcoinNetwork(network) : null;
};
