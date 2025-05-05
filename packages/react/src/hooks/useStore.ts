import { useStore as useZustandStore } from "zustand";
import { useStoreInternal } from "~/hooks/useStoreInternal";
import type { MidlContextStore } from "~/types";

/**
 * Accesses the global state within the Midl context.
 *
 * @example
 * ```typescript
 * const store = useStore();
 * ```
 *
 * @returns `Store` – The Zustand store instance.
 */
export const useStore = (customStore?: MidlContextStore) => {
	const store = useStoreInternal(customStore);

	return useZustandStore(store);
};
