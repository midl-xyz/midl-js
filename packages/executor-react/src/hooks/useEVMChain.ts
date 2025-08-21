import type { Config } from "@midl/core";
import { type Chain, getEVMFromBitcoinNetwork } from "@midl/executor";
import { useConfig } from "@midl/react";

type UseEVMChainParams = {
	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
	/**
	 * Custom EVM chain to override the default.
	 */
	chain?: Chain;
};

/**
 * Gets the EVM chain associated with the current Bitcoin network.
 *
 * @returns The EVM chain configuration if available, otherwise `null`.
 *
 * @example
 * const evmChain = useEVMChain();
 * if (evmChain) {
 *   console.log(`EVM Chain Name: ${evmChain.name}`);
 * }
 */
export const useEVMChain = ({
	config: customConfig,
	chain: customChain,
}: UseEVMChainParams = {}) => {
	const { network } = useConfig(customConfig);

	if (customChain) {
		return customChain;
	}

	try {
		return getEVMFromBitcoinNetwork(network);
	} catch (error) {
		return null;
	}
};
