import createClient, { type Client } from "openapi-fetch";
import type { BitcoinNetwork } from "~/createConfig";
import type {
	AbstractProvider,
	FeeRateResponse,
	TransactionStatusResponse,
	UTXO,
} from "~/providers/AbstractProvider";
import type { paths } from "./scheme/maestro";

type RPCUrlMap = Partial<Record<BitcoinNetwork["id"], string>>;

export class MaestroProvider implements AbstractProvider {
	private readonly client: Client<paths>;

	constructor(
		/**
		 * The API key for Maestro.
		 * Get one at https://www.gomaestro.org/
		 */
		private readonly apiKey: string,
		/**
		 * The RPC URLs for the networks. If not provided, defaults will be used.
		 */
		private readonly rpcUrl: RPCUrlMap = {
			mainnet: "https://xbt-mainnet.gomaestro-api.org/v0",
			testnet: "https://xbt-testnet.gomaestro-api.org/v0",
		},
	) {
		this.client = createClient<paths>({
			headers: {
				"x-api-key": this.apiKey,
			},
		});
	}

	async getUTXOs(network: BitcoinNetwork, address: string): Promise<UTXO[]> {
		const { data } = await this.client.GET("/addresses/{address}/utxos", {
			baseUrl: this.getApURL(network),
			params: {
				path: {
					address,
				},
			},
		});

		if (!data?.data) {
			return [];
		}

		return data.data.map((it) => ({
			txid: it.txid,
			vout: it.vout,
			value: Number.parseInt(it.satoshis, 10),
			status: {
				confirmed: it.confirmations > 0,
				block_height: it.height,
			},
		}));
	}

	async broadcastTransaction(
		network: BitcoinNetwork,
		txHex: string,
	): Promise<string> {
		const { data } = await this.client.POST("/rpc/transaction/submit", {
			baseUrl: this.getApURL(network),
			body: txHex,
		});

		if (!data) {
			throw new Error("Failed to broadcast transaction.");
		}

		return data;
	}

	async getLatestBlockHeight(network: BitcoinNetwork): Promise<number> {
		const { data } = await this.client.GET("/rpc/block/latest", {
			baseUrl: this.getApURL(network),
		});

		if (typeof data?.data?.height === "undefined") {
			throw new Error("Failed to fetch latest block height.");
		}

		return data.data.height;
	}
	async getFeeRate(network: BitcoinNetwork): Promise<FeeRateResponse> {
		const { data } = await this.client.GET("/mempool/fee_rates", {
			baseUrl: this.getApURL(network),
		});

		// We assume the first entry is the most recent fee rate
		const [feeRates] = data?.data ?? [];

		if (!feeRates) {
			throw new Error("Failed to fetch fee rates.");
		}

		return {
			fastestFee: feeRates.sats_per_vb.max,
			halfHourFee: feeRates.sats_per_vb.max,
			hourFee: feeRates.sats_per_vb.median,
			economyFee: feeRates.sats_per_vb.median,
			minimumFee: feeRates.sats_per_vb.min,
		};
	}

	async getTransactionStatus(
		network: BitcoinNetwork,
		txid: string,
	): Promise<TransactionStatusResponse> {
		const { data } = await this.client.GET("/rpc/transaction/{tx_hash}", {
			baseUrl: this.getApURL(network),
			params: {
				path: {
					tx_hash: txid,
				},
			},
		});

		const tx = data?.data;

		if (!tx) {
			throw new Error(`Transaction ${txid} not found.`);
		}

		if (
			typeof tx.confirmations === "undefined" ||
			typeof tx.blockheight === "undefined"
		) {
			throw new Error(
				`Transaction ${txid} is missing confirmation or block height data.`,
			);
		}

		return {
			confirmed: tx.confirmations > 0,
			block_height: tx.blockheight,
		};
	}

	async getTransactionHex(
		network: BitcoinNetwork,
		txid: string,
	): Promise<string> {
		const { data } = await this.client.GET("/esplora/tx/{txid}/hex", {
			baseUrl: this.getApURL(network),
			params: {
				path: {
					txid,
				},
			},
		});

		if (!data) {
			throw new Error(`Transaction ${txid} not found.`);
		}

		return data;
	}

	private getApURL(network: BitcoinNetwork): string {
		const url = this.rpcUrl[network.id];

		if (!url) {
			throw new Error(`No RPC URL configured for network ${network.id}`);
		}

		return url;
	}
}
