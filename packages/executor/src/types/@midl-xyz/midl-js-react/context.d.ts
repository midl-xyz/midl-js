import "@midl-xyz/midl-js-react";
import type { TransactionSerializableBTC } from "viem";

declare module "@midl-xyz/midl-js-react" {
	type State = {
		readonly wallet?: {
			[key: string]: {
				nonce: number;
				transactions: string[];
			};
		};

		readonly intentions?: Array<Omit<TransactionSerializableBTC, "chainId">>;
	};

	export interface MidlContextState extends State {}
}
