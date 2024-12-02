import { useMidlContext } from "~/context";

/**
 * Hook to get the config object from the context
 * @returns The config object
 */
export const useConfig = () => {
	const { config } = useMidlContext();
	return config;
};
