import { useMidlContext } from "~/context";

/**
 * Retrieves the current configuration
 *
 * @example
 * ```typescript
 * const config = useConfig();
 * console.log(config.networks);
 * ```
 *
 * @returns **Config** – The current configuration object.
 */
export const useConfig = () => {
	const { config } = useMidlContext();
	return config;
};
