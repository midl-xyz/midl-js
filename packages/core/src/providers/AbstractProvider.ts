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
        /**
         * The block hash of the UTXO
         */
        readonly block_hash: string;
        /**
         * The block time of the UTXO
         */
        readonly block_time: number;
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

export type RuneResponse = {
    /**
     * The rune ID
     */
    id: string;
    /**
     * The rune name
     */
    name: string;
    /**
     * The rune spaced name
     */
    spaced_name: string;
    /**
     * The rune number
     */
    number: number;
    /**
     * The rune divisibility
     */
    divisibility: number;
    /**
     * The rune symbol
     */
    symbol: string;
    turbo: boolean;
    mint_terms: {
        amount: number | null;
        cap: number | null;
        height_start: number | null;
        height_end: number | null;
        offset_start: number | null;
        offset_end: number | null;
    };
    supply: {
        current: string;
        minted: string;
        total_mints: string;
        mint_percentage: string;
        mintable: boolean;
        burned: string;
        total_burns: string;
        premine: string;
    };
    location: {
        block_hash: string;
        block_height: number;
        tx_id: string;
        tx_index: number;
        timestamp: number;
    };
};

export type RuneBalanceResponse = {
    /**
     * The address
     */
    address?: string;
    /**
     * The balance of the rune
     */
    balance: string;
};

export type RunesResponse = {
    /**
     * The limit of runes (MempoolSpace)
     */
    limit?: number;
    /**
     * The offset of runes (MempoolSpace)
     */
    offset?: number;
    /**
     * The total number of runes (MempoolSpace)
     */
    total?: number;
    /**
     * The max number of runes returned per page (Maestro)
     */
    count?: number;
    /**
     * The cursor for the next page, or null if no more pages (Maestro)
     */
    next_cursor?: string | null;
    /**
     * The results
     */
    results: {
        /**
         * The rune details
         */
        rune: {
            id: string;
            number: number;
            name: string;
            spaced_name: string;
        };
        /**
         * The balance of the rune
         */
        balance: string;
        /**
         * The address
         */
        address: string;
    }[];
};

export type RuneUTXO = {
    /**
     * The height of the UTXO
     */
    height: number;
    /**
     * The address of the UTXO
     */
    address: string;
    /**
     * The txid of the UTXO
     */
    txid: string;
    /**
     * The vout of the UTXO
     */
    vout: number;
    /**
     * The amount of satoshis
     */
    satoshis: number;
    /**
     * The scriptPubKey
     */
    scriptPk: string;
    /**
     * The runes in the UTXO
     */
    runes: {
        rune: string;
        runeid: string;
        spacedRune: string;
        amount: string;
        symbol: string;
        divisibility: number;
    }[];
};

export type TransactionStatusResponse = {
    confirmed: boolean;
    block_height: number;
};

export interface AbstractProvider {
    getUTXOs(network: BitcoinNetwork, address: string): Promise<UTXO[]>;

    broadcastTransaction(
        network: BitcoinNetwork,
        txHex: string
    ): Promise<string>;

    getLatestBlockHeight(network: BitcoinNetwork): Promise<number>;

    getFeeRate(network: BitcoinNetwork): Promise<FeeRateResponse>;

    getRune(network: BitcoinNetwork, runeId: string): Promise<RuneResponse>;

    getRuneBalance(
        network: BitcoinNetwork,
        address: string,
        runeId: string
    ): Promise<RuneBalanceResponse>;

    getRunes(
        network: BitcoinNetwork,
        address: string,
        params?: {
            // MempoolSpace
            limit?: number;
            offset?: number;
            // Maestro
            count?: number;
            cursor?: string;
        }
    ): Promise<RunesResponse>;

    getRuneUTXOs(
        network: BitcoinNetwork,
        address: string,
        runeId: string
    ): Promise<RuneUTXO[]>;

    getTransactionStatus(
        network: BitcoinNetwork,
        txid: string
    ): Promise<TransactionStatusResponse>;

    getTransactionHex(network: BitcoinNetwork, txid: string): Promise<string>;
}
