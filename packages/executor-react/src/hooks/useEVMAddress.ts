import { type Config, getDefaultAccount } from "@midl-xyz/midl-js-core";
import { getEVMAddress } from "@midl-xyz/midl-js-executor";
import { useConfig, useConfigInternal } from "@midl-xyz/midl-js-react";
import { zeroAddress } from "viem";
import { usePublicKey } from "~/hooks/usePublicKey";

type UseEVMAddressParams = {
	/**
	 * The public key to get the EVM address from
	 */
	publicKey?: string;

	config?: Config;
};

/**
 * Gets the EVM address from a public key
 * If no public key is provided, it uses the connected payment or ordinals account's public key.
 *
 * @example
 * ```ts
 * const evmAddress = useEVMAddress({ publicKey: '0xabc123...' });
 * ```
 */
export const useEVMAddress = ({
	publicKey,
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
			publicKey ? (it) => it.publicKey === publicKey : undefined,
		);

		return getEVMAddress(account, config.network);
	} catch (e) {
		console.error("Error getting EVM address:", e);
		return zeroAddress;
	}
};
