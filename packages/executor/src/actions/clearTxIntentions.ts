import type { MidlContextState } from "@midl-xyz/midl-js-react";
import type { StoreApi } from "zustand";

/**
 * Clear all transaction intentions from the store
 *
 * @param store The store object
 */
export const clearTxIntentions = (store: StoreApi<MidlContextState>) => {
	store.setState({ intentions: [] });
};
