import type { TransactionIntention } from "@midl/executor";
import { createStore as createZustandStore } from "zustand/vanilla";

export type MidlHardhatStore = {
	intentions: TransactionIntention[];
};

export const createStore = () => {
	return createZustandStore<MidlHardhatStore>(() => ({
		intentions: [],
	}));
};
