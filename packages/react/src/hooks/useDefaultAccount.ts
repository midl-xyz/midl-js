import { type Config, getDefaultAccount } from "@midl-xyz/midl-js-core";
import { useConfig, useConfigInternal } from "@midl-xyz/midl-js-react";

type UseEVMAddressParams = {
	config?: Config;
};

/**
 * Gets the default BTC account
 *
 * @example
 * ```ts
 * const defaultBTCAccount = useDefaultAccount();
 * ```
 */
export const useDefaultAccount = ({
	config: customConfig,
}: UseEVMAddressParams = {}) => {
	const configInternal = useConfigInternal(customConfig);

	try {
		return getDefaultAccount(configInternal);
	} catch (e) {
		console.error("Error getting default BTC account:", e);
		return null;
	}
};
