import { useMidlContext } from "~/context";

/**
 * Custom hook to access the configuration context.
 *
 * This hook retrieves the current configuration from the Midl context, providing access to connectors, networks, and connections.
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
