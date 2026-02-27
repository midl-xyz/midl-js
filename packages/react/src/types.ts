import type { Config } from "@midl/core";
import type { StoreApi } from "zustand/vanilla";

// biome-ignore lint/complexity/noBannedTypes: this is intentional
export type MidlContextState = {};

export type MidlContextStore = StoreApi<MidlContextState>;

export interface MidlContextType {
	readonly config: Config;
	readonly store: MidlContextStore;
}
