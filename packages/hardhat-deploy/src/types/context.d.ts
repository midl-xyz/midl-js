import "@midl-xyz/midl-js-react";
import type { TransactionIntention } from "node_modules/@midl-xyz/midl-js-executor/dist/types/types/intention";

declare module "@midl-xyz/midl-js-react" {
	type State = {
		readonly intentions?: TransactionIntention[];
	};

	export interface MidlContextState extends State {}
}
