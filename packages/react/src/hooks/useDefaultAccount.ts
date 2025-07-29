import { type Config, getDefaultAccount } from "@midl-xyz/midl-js-core";
import { useConfigInternal } from "~/index";

type useDefaultAccountParams = {
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
}: useDefaultAccountParams = {}) => {
	const configInternal = useConfigInternal(customConfig);

	try {
		return getDefaultAccount(configInternal);
	} catch (e) {
		console.error("Error getting default BTC account:", e);
		return null;
	}
};
