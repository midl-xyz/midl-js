import "@midl-xyz/midl-js-executor";

declare module "@midl-xyz/midl-js-executor" {
	export interface TransactionIntention {
		meta?: {
			contractName?: string;
		};
	}
}
