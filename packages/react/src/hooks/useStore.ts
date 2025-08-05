import { useStore as useZustandStore } from "zustand";
import { useStoreInternal } from "~/hooks/useStoreInternal";
import type { MidlContextStore } from "~/types";

/**
 * Accesses the global state within the Midl context using Zustand.
 *
 * @param customStore (optional) A custom Zustand store instance to use instead of the default context store.
 *
 * @example
 * ```typescript
 * const store = useStore();
 * // or with a custom store
 * const store = useStore(customStore);
 * ```
 *
 * @returns The Zustand store instance for the current context (or the provided custom store).
 */
export const useStore = (customStore?: MidlContextStore) => {
	const store = useStoreInternal(customStore);

	return useZustandStore(store);
};
