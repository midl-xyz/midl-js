import type { TransactionIntention } from "@midl/executor";
import "@midl/react";

declare module "@midl/react" {
	type State = {
		readonly intentions?: TransactionIntention[];
	};

	export interface MidlContextState extends State {}
}
