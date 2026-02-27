import { type Config, getDefaultAccount } from "@midl/core";
import { useConfigInternal } from "~/hooks/useConfigInternal";

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
	} catch {
		return null;
	}
};
