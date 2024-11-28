import type { TransactionSerializableBTC } from "viem";

export type TransactionIntention = {
	/**
	 * EVM transaction to execute
	 */
	evmTransaction: TransactionSerializableBTC;

	/**
	 * EVM transaction to execute
	 * This is a serialized version of the transaction
	 */
	signedEvmTransaction?: `0x${string}`;

	/**
	 * Native token value to transfer to Midl
	 */
	value?: bigint;
	/**
	 * Rune id and value to transfer to Midl
	 */
	rune?: {
		id: string;
		value: bigint;
	};

	hasRunesWithdraw?: boolean;
	hasWithdraw?: boolean;
	hasDeposit?: boolean;
	hasRunesDeposit?: boolean;
};
