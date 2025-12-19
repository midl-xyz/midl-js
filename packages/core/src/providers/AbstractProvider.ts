import type { BitcoinNetwork } from "~/createConfig";

export type UTXO = {
	/**
	 * The transaction ID of the UTXO
	 */
	readonly txid: string;
	/**
	 * The output index of the UTXO
	 */
	readonly vout: number;
	/**
	 * The value of the UTXO
	 */
	readonly value: number;
	/**
	 * The status of the UTXO
	 */
	readonly status: {
		/**
		 * Whether the UTXO is confirmed
		 */
		readonly confirmed: boolean;
		/**
		 * The block height of the UTXO
		 */
		readonly block_height: number;
	};
};

export type FeeRateResponse = {
	/**
	 * The fastest fee rate in satoshis per byte
	 */
	fastestFee: number;
	/**
	 * The half hour fee rate in satoshis per byte
	 */
	halfHourFee: number;
	/**
	 * The hour fee rate in satoshis per byte
	 */
	hourFee: number;
	/**
	 * The economy fee rate in satoshis per byte
	 */
	economyFee: number;
	/**
	 * The minimum fee rate in satoshis per byte
	 */
	minimumFee: number;
};

export type TransactionStatusResponse = {
	confirmed: boolean;
	block_height: number;
};

export interface AbstractProvider {
	getUTXOs(network: BitcoinNetwork, address: string): Promise<UTXO[]>;

	broadcastTransaction(network: BitcoinNetwork, txHex: string): Promise<string>;

	getLatestBlockHeight(network: BitcoinNetwork): Promise<number>;

	getFeeRate(network: BitcoinNetwork): Promise<FeeRateResponse>;

	getTransactionStatus(
		network: BitcoinNetwork,
		txid: string,
	): Promise<TransactionStatusResponse>;

	getTransactionHex(network: BitcoinNetwork, txid: string): Promise<string>;

	waitForTransaction?(
		network: BitcoinNetwork,
		txid: string,
		requiredConfirmations?: number,
		options?: { timeoutMs?: number },
	): Promise<number>;
}
