import type { TransactionIntention } from "@midl-xyz/midl-js-executor";
import "@midl-xyz/midl-js-react";

declare module "@midl-xyz/midl-js-react" {
	type State = {
		readonly intentions?: TransactionIntention[];
	};

	export interface MidlContextState extends State {}
}
