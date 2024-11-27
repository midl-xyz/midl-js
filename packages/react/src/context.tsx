import type { Config } from "@midl-xyz/midl-js-core";
import { createContext, useContext, useEffect, useMemo } from "react";

import { type StoreApi, createStore } from "zustand/vanilla";

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface MidlContextState {}

export interface MidlContextType {
	readonly config: Config;
	readonly store: StoreApi<MidlContextState>;
}

export const MidlContext = createContext<MidlContextType>({
	config: {} as Config,
	store: {} as StoreApi<MidlContextState>,
});

export const useMidlContext = () => {
	return useContext(MidlContext);
};

export const MidlProvider = ({
	config,
	children,
	initialState,
}: Readonly<{
	config: Config;
	children: React.ReactNode;
	initialState?: MidlContextState;
}>) => {
	const store = useMemo(
		() =>
			createStore<MidlContextState>()(() => ({
				...initialState,
			})),
		[initialState],
	);

	return (
		<MidlContext.Provider
			value={{
				config,
				store,
			}}
		>
			{children}
		</MidlContext.Provider>
	);
};
