import type { Config } from "@midl-xyz/midl-js-core";
import { useEffect, useState } from "react";
import { useConfigInternal } from "~/hooks/useConfigInternal";

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
