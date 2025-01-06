import type { MidlContextState } from "@midl-xyz/midl-js-react";
import type { StoreApi } from "zustand";

export const clearTxIntentions = (store: StoreApi<MidlContextState>) => {
	store.setState({ intentions: [] });
};
