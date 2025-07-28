import { type Config, getDefaultAccount } from "@midl-xyz/midl-js-core";
import { useConfig, useConfigInternal } from "@midl-xyz/midl-js-react";

type UseEVMAddressParams = {
	config?: Config;
};

/**
 * Gets the default BTC account, prioritizing Native Segwit address. Otherwise returns first one found
 *
 * @example
 * ```ts
 * const defaultBTCAddress = useDefaultAccount();
 * ```
 */
export const useDefaultAccount = ({
	config: customConfig,
}: UseEVMAddressParams = {}) => {
	const config = useConfig(customConfig);
	const configInternal = useConfigInternal(customConfig);

	try {
		return getDefaultAccount(configInternal);
	} catch (e) {
		console.error("Error getting default BTC account:", e);
		return null;
	}
};
