import { useMidlContext } from "~/context";
import { useStore as useZustandStore } from "zustand";

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
export const useStore = () => {
	const { store } = useMidlContext();
	return useZustandStore(store);
};
