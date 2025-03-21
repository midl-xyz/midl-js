import { useEffect, useState } from "react";
import { useMidlContext } from "~/context";

export const useHydrated = () => {
	const { config } = useMidlContext();
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		if (config.persist?.hasHydrated()) {
			setHydrated(true);
		}
	}, [config.persist]);

	return hydrated;
};
