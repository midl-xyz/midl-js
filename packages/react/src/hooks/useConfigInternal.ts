import type { Config } from "@midl-xyz/midl-js-core";
import { useMidlContext } from "~/context";

/**
 * Retrieves the current configuration
 * For internal use only. Use `useConfig` for public API.
 *
 * @example
 * ```typescript
 * const config = useConfigInternal();
 * ```
 *
 * @returns **Config** – The current configuration object.
 */
export const useConfigInternal = (customConfig?: Config) => {
	const context = useMidlContext();
	const config = customConfig ?? context.config;

	if (!config) {
		throw new Error("No config provided");
	}

	return config;
};
