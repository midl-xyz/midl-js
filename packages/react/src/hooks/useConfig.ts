import type { Config } from "@midl-xyz/midl-js-core";
import { useStore } from "zustand";
import { useConfigInternal } from "~/hooks/useConfigInternal";

/**
 * Retrieves the current configuration
 *
 * @params customConfig - Custom configuration to override the default.
 *
 * @example
 * ```typescript
 * const config = useConfig();
 * console.log(config.networks);
 * ```
 *
 * @returns **Config** – The current configuration object.
 */
export const useConfig = (customConfig?: Config) => {
	const config = useConfigInternal(customConfig);

	if (!config) {
		throw new Error("No config provided");
	}

	return useStore(config);
};
