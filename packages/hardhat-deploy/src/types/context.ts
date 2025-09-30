import "@midl/executor";

declare module "@midl/executor" {
	export interface TransactionIntention {
		meta?: {
			contractName?: string;
		};
	}
}
