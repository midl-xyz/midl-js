import type { Config } from "@midl-xyz/midl-js-core";
import { getEVMAddress } from "@midl-xyz/midl-js-executor";
import { useConfig } from "@midl-xyz/midl-js-react";
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
	const pk = usePublicKey({
		publicKey,
		config: customConfig,
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
