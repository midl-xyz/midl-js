import type * as React from "react";

declare module "wagmi" {
	// React 19 type compatibility shim: wagmi's provider typing can be too narrow
	// under newer React type definitions, causing TS2786 at JSX call sites.
	// biome-ignore lint/suspicious/noExplicitAny: this is intentional
	export const WagmiProvider: React.ComponentType<any>;
}
