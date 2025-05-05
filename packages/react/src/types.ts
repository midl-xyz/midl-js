import type { Config } from "@midl-xyz/midl-js-core";
import type { StoreApi } from "zustand/vanilla";

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface MidlContextState {}

export type MidlContextStore = StoreApi<MidlContextState>;

export interface MidlContextType {
	readonly config: Config;
	readonly store: MidlContextStore;
}
