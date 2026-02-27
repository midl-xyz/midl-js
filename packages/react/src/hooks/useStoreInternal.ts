import { useMidlContext } from "~/context";
import type { MidlContextStore } from "~/types";

/**
 * Accesses the global state within the Midl context.
 * For internal use only.s
 *
 * @example
 * ```typescript
 * const store = useStoreInternal();
 * ```
 *
 * @returns `Store` – The Zustand store instance.
 */
export const useStoreInternal = (customStore?: MidlContextStore) => {
	const context = useMidlContext();

	const store = customStore ?? context.store;

	if (!store) {
		throw new Error("No store provided");
	}

	return store;
};
