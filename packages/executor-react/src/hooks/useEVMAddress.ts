import { type Config, getDefaultAccount } from "@midl/core";
import { getEVMAddress } from "@midl/executor";
import { useConfig, useConfigInternal } from "@midl/react";
import { zeroAddress } from "viem";

type UseEVMAddressParams = {
	/**
	 * The BTC address of the account to get the EVM address from.
	 */
	from?: string;

	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
};

/**
 * Gets the EVM address from a public key.
 *
 * If no public key is provided, it uses the connected payment or ordinals account.
 *
 * @returns The EVM address as a string (or zero address if not available).
 *
 * @example
 * const evmAddress = useEVMAddress({ from: 'bcrt...' });
 */
export const useEVMAddress = ({
	from,
	config: customConfig,
}: UseEVMAddressParams = {}) => {
	const config = useConfig(customConfig);
	const configInternal = useConfigInternal(customConfig);

	try {
		if (!config.connection) {
			return zeroAddress;
		}

		const account = getDefaultAccount(
			configInternal,
			from ? (it) => it.address === from : undefined,
		);

		return getEVMAddress(account, config.network);
	} catch (e) {
		console.error("Error getting EVM address:", e);
		return zeroAddress;
	}
};
