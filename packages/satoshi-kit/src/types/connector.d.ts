import "@midl-xyz/midl-js-core";

declare module "@midl-xyz/midl-js-core" {
	export interface UserMetadata {
		isPartner?: boolean;
		group?: "popular";
	}
}
