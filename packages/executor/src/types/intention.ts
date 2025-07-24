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

	/**
	 * BTC amount to transfer to MIDL in satoshis
	 */
	satoshis?: number;
	/**
	 * Runes to transfer to MIDL
	 */
	runes?: {
		id: string;
		value: bigint;
		/**
		 * Define address for state override
		 */
		address?: Address;
	}[];
	/**
	 * If true, the intention contains runes to withdraw
	 */
	hasRunesWithdraw?: boolean;
	/**
	 * If true, the intention contains Bitcoin to withdraw
	 */
	hasWithdraw?: boolean;
	/**
	 * If true, the intention contains a Rune deposit
	 */
	hasRunesDeposit?: boolean;
}
