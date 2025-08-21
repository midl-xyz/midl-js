import "@midl/core";

declare module "@midl/core" {
	export interface UserMetadata {
		isPartner?: boolean;
		group?: "popular";
	}
}
