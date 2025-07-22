import type { BitcoinNetwork } from "~/createConfig";
import type {
    AbstractProvider,
    FeeRateResponse,
    RuneBalanceResponse,
    RuneResponse,
    RunesResponse,
    RuneUTXO,
    TransactionStatusResponse,
    UTXO,
} from "~/providers/AbstractProvider";

export const maestroRPC: Record<BitcoinNetwork["id"], string> = {
    mainnet: "https://xbt-mainnet.gomaestro-api.org/v0",
    testnet: "",
    testnet4: "https://xbt-testnet.gomaestro-api.org/v0",
    regtest: "",
};

export class MaestroProvider implements AbstractProvider {
    constructor(
        private readonly rpcUrlMap: Record<
            BitcoinNetwork["id"],
            string
        > = maestroRPC,
        private readonly apiKey?: string
    ) {}

    async broadcastTransaction(
        network: BitcoinNetwork,
        txHex: string
    ): Promise<string> {
        // OpenAPI: POST /rpc/transaction/submit
        let url = `${this.getApURL(network)}/rpc/transaction/submit`;
        if (this.apiKey) url += `?api-key=${this.apiKey}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ hex: txHex }),
        });
        if (!response.ok) {
            throw new Error(
                `Failed to broadcast transaction: ${response.statusText}`
            );
        }
        // Response: BroadcastResponse (assume txid string)
        const data = await response.json();
        return data.txid || data.result || "";
    }
    async getLatestBlockHeight(network: BitcoinNetwork): Promise<number> {
        // OpenAPI: GET /blocks/tip/height
        let url = `${this.getApURL(network)}/blocks/tip/height`;
        if (this.apiKey) url += `?api-key=${this.apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch block height: ${response.statusText}`
            );
        }
        // Response: BlockHeight (number)
        const blockHeight = await response.json();
        return typeof blockHeight === "number"
            ? blockHeight
            : blockHeight.height;
    }
    async getFeeRate(network: BitcoinNetwork): Promise<FeeRateResponse> {
        // OpenAPI: GET /mempool/fee_rates
        let url = `${this.getApURL(network)}/mempool/fee_rates`;
        if (this.apiKey) url += `?api-key=${this.apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch fee rate: ${response.statusText}`);
        }
        // Response: MempoolTimestampedFeeRates (adapt to FeeRateResponse)
        const feeRate = await response.json();
        return feeRate;
    }
    async getRune(
        network: BitcoinNetwork,
        runeId: string
    ): Promise<RuneResponse> {
        // OpenAPI: GET /assets/runes/{rune}
        let url = `${this.getApURL(network)}/assets/runes/${runeId}`;
        if (this.apiKey) url += `?api-key=${this.apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch rune: ${response.statusText}`);
        }
        const rune: RuneResponse = await response.json();
        return rune;
    }
    async getRuneBalance(
        network: BitcoinNetwork,
        address: string,
        runeId: string
    ): Promise<RuneBalanceResponse> {
        // OpenAPI: GET /assets/runes/{rune}/holders
        let url = `${this.getApURL(network)}/assets/runes/${runeId}/holders`;
        if (this.apiKey) url += `?api-key=${this.apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch rune balance: ${response.statusText}`
            );
        }
        // Response: PaginatedRuneHolder, filter for address
        const holders = await response.json();
        // Find the holder for the address
        const holder = holders?.items?.find((h: any) => h.address === address);
        return holder || {};
    }
    async getRunes(
        network: BitcoinNetwork,
        address: string,
        params: {
            count?: number;
            cursor?: string;
            limit?: number;
            offset?: number;
        } = {}
    ): Promise<RunesResponse> {
        // OpenAPI: GET /addresses/{address}/runes (cursor-based pagination)
        const searchParams = new URLSearchParams();
        if (params.count) searchParams.append("count", String(params.count));
        if (params.cursor) searchParams.append("cursor", params.cursor);
        let url = `${this.getApURL(network)}/addresses/${address}/runes?${searchParams.toString()}`;
        if (this.apiKey)
            url +=
                (searchParams.toString() ? "&" : "?") +
                `api-key=${this.apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch runes: ${response.statusText}`);
        }
        const data: RunesResponse = await response.json();
        return data;
    }
    async getRuneUTXOs(
        network: BitcoinNetwork,
        address: string,
        runeId: string
    ): Promise<RuneUTXO[]> {
        // OpenAPI: GET /addresses/{address}/runes/utxos
        let url = `${this.getApURL(network)}/addresses/${address}/runes/utxos?rune=${runeId}`;
        if (this.apiKey) url += `&api-key=${this.apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch rune UTXOs: ${response.statusText}`
            );
        }
        const data: RuneUTXO[] = await response.json();
        return data;
    }
    async getTransactionStatus(
        network: BitcoinNetwork,
        txid: string
    ): Promise<TransactionStatusResponse> {
        // OpenAPI: GET /transactions/{tx_hash}
        let url = `${this.getApURL(network)}/transactions/${txid}`;
        if (this.apiKey) url += `?api-key=${this.apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch transaction status: ${response.statusText}`
            );
        }
        const data: TransactionStatusResponse = await response.json();
        return data;
    }
    async getTransactionHex(
        network: BitcoinNetwork,
        txid: string
    ): Promise<string> {
        // OpenAPI: GET /transactions/{tx_hash}/hex
        let url = `${this.getApURL(network)}/transactions/${txid}/hex`;
        if (this.apiKey) url += `?api-key=${this.apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch transaction hex: ${response.statusText}`
            );
        }
        const data: string = await response.text();
        return data;
    }
    async getUTXOs(network: BitcoinNetwork, address: string): Promise<UTXO[]> {
        // OpenAPI: GET /addresses/{address}/utxos
        let url = `${this.getApURL(network)}/addresses/${address}/utxos`;
        if (this.apiKey) url += `?api-key=${this.apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch UTXOs: ${response.statusText}`);
        }
        const utxos: UTXO[] = await response.json();
        return utxos;
    }

    private getApURL(network: BitcoinNetwork) {
        return this.rpcUrlMap[network.id] || this.rpcUrlMap.mainnet;
    }
}
