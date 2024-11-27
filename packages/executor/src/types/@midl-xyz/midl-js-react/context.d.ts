import "@midl-xyz/midl-js-react";
import type { TransactionIntention } from "~/types/intention";

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
