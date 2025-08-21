"use client";

import type { Config } from "@midl/core";
import { createContext, useContext, useMemo } from "react";

import { createStore } from "zustand/vanilla";
import type { MidlContextState, MidlContextType } from "~/types";

export const MidlContext = createContext<MidlContextType>(
	undefined as unknown as MidlContextType,
);

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
