import type { Config } from "@midl/core";
import { useEffect, useState } from "react";
import { useConfigInternal } from "~/hooks/useConfigInternal";

/**
 * Checks if the configuration store has been hydrated (i.e., loaded from persistent storage).
 *
 * @param config (optional) Custom config to override the default from context.
 *
 * @returns {boolean} Whether the config store is hydrated or not.
 *
 * @example
 * const hydrated = useHydrated();
 * if (!hydrated) return <div>Loading...</div>;
 * return <div>App is hydrated!</div>;
 */
type UseHydratedParams = {
	config?: Config;
};

export const useHydrated = ({
	config: customConfig,
}: UseHydratedParams = {}) => {
	const config = useConfigInternal(customConfig);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		if (config.persist?.hasHydrated()) {
			setHydrated(true);
		}
	}, [config]);

	return hydrated;
};
