import type { Address, TransactionSerializableBTC } from "viem";

export interface TransactionIntention {
	/**
	 * EVM transaction to execute
	 */
	evmTransaction: TransactionSerializableBTC & {
		from?: Address;
	};

	/**
	 * Serialized signed EVM transaction
	 */
	signedEvmTransaction?: `0x${string}`;

	deposit?: {
		satoshis?: number;
		runes?: {
			id: string;
			amount: bigint;
			address: Address;
		}[];
	};

	withdraw?: {
		/**
		 * The amount in satoshis to withdraw, if not provided it will withdraw all available balance.
		 */
		satoshis?: number;
		runes?: {
			id: string;
			amount: bigint;
			address: Address;
		}[];
	};
}
