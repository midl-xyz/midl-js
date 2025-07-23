import type { TransactionIntention } from "@midl-xyz/midl-js-executor";
import "@midl-xyz/midl-js-react";

declare module "@midl-xyz/midl-js-react" {
	type State = {
		readonly wallet?: {
			[key: string]: {
				nonce: number;
				transactions: string[];
			};
		};

		readonly intentions?: TransactionIntention[];
	};

	export interface MidlContextState extends State {}
}
