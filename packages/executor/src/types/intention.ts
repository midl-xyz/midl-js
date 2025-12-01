import type { Address, TransactionSerializableBTC } from "viem";

export type RunesTransfer = {
	/**
	 * The rune ID, in the format `blockHeight:txIndex`
	 */
	id: string;
	/**
	 * The amount to transfer
	 */
	amount: bigint;

	/**
	 * ERC20 Address corresponding to the rune. If not provided, it will be derived using Create2.
	 */
	address?: Address;
};

export type Deposit = {
	/**
	 * The amount in satoshis to deposit, if not provided it will deposit all available balance.
	 */
	satoshis?: number;
	runes?: RunesTransfer[];
};

export type Withdrawal = {
	/**
	 * The amount in satoshis to withdraw, if not provided it will withdraw all available balance.
	 */
	satoshis?: number;
	runes?: RunesTransfer[];
};

export type TransactionIntentionSimple = {
	deposit?: Deposit;
	withdraw?: Withdrawal | boolean;
};

export type IntentionEVMTransaction = TransactionSerializableBTC & {
	from?: Address;
};

export type TransactionIntentionEVM = {
	evmTransaction: IntentionEVMTransaction;
	signedEvmTransaction?: `0x${string}`;
} & TransactionIntentionSimple;

export interface TransactionIntention
	extends Omit<TransactionIntentionEVM, "evmTransaction"> {
	evmTransaction?: IntentionEVMTransaction;
}
