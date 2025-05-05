import { createStore as createZustandStore } from "zustand/vanilla";
import type { MidlContextState } from "~/types";

export const createStore = (initialState: MidlContextState) => {
	return createZustandStore<MidlContextState>()(() => ({
		...initialState,
	}));
};
