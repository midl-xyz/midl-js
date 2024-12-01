import { useMidlContext } from "~/context";
import { useStore as useZustandStore } from "zustand";

/**
 * Custom hook to access the global store using Zustand.
 *
 * This hook provides access to the global state managed by Zustand within the Midl context.
 *
 * @example
 * ```typescript
 * const store = useStore();
 * const user = store.user;
 * ```
 *
 * @returns `Store` – The Zustand store instance.
 */
export const useStore = () => {
	const { store } = useMidlContext();
	return useZustandStore(store);
};
