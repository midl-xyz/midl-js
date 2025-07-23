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
	 * Rune id and value to transfer to Midl
	 */
	rune?: {
		id: string;
		value: bigint;
	};
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
