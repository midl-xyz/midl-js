import { useMidlContext } from "~/context";
import { useStore as useZustandStore } from "zustand";

export const useStore = () => {
	const { store } = useMidlContext();
	return useZustandStore(store);
};
