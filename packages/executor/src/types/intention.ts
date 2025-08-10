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
	 * ERC20 address of the rune
	 */
	address: Address;
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

	deposit?: Deposit;

	withdraw?: Withdrawal | boolean;
}
