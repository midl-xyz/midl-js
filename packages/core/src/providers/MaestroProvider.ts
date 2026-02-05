import createClient, { type Client } from "openapi-fetch";
import { logger } from "~/config/index.js";
import type { BitcoinNetwork } from "~/createConfig.js";
import type {
	AbstractProvider,
	FeeRateResponse,
	TransactionStatusResponse,
	UTXO,
} from "~/providers/AbstractProvider.js";
import type {
	AbstractRunesProvider,
	RuneBalanceResponse,
	RuneResponse,
	RuneUTXO,
	RunesResponse,
} from "~/providers/runes/index.js";
import type { components, paths } from "./scheme/maestro.js";

type RPCUrlMap = Partial<Record<BitcoinNetwork["id"], string>>;

export class MaestroProvider
	implements AbstractProvider, AbstractRunesProvider
{
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
		this.client = createClient<paths>();

		this.client.use({
			onRequest: async ({ request }) => {
				request.headers.set("api-key", this.apiKey);

				return request;
			},
			onResponse: async ({ response }) => {
				if (!response.ok) {
					const responseJSON = await response.clone().json();

					logger.error("Maestro API error", {
						status: response.status,
						statusText: response.statusText,
					});

					throw new MaestroAPIError(
						`Maestro API error: ${response.status} ${responseJSON?.message ?? response.statusText}`,
						response.status,
					);
				}
			},
		});
	}

	async getRune(
		network: BitcoinNetwork,
		runeId: string,
	): Promise<RuneResponse> {
		const { data } = await this.client.GET("/assets/runes/{rune}", {
			baseUrl: this.getApURL(network),
			params: {
				path: { rune: runeId },
			},
		});

		if (!data?.data) {
			throw new Error(`Rune with ID ${runeId} not found.`);
		}

		const {
			id,
			name,
			spaced_name,
			symbol,
			divisibility,
			terms,
			etching_height,
			etching_tx,
			circulating_supply,
			mints,
			premine,
		} = data.data;

		return {
			id,
			name,
			spaced_name,
			divisibility,
			symbol: symbol ?? "¤",
			mint_terms: {
				amount: terms.amount_per_mint ? BigInt(terms.amount_per_mint) : null,
				cap: terms.mint_txs_cap ? BigInt(terms.mint_txs_cap) : null,
				height_start: terms.start_height ? Number(terms.start_height) : null,
				height_end: terms.end_height ? Number(terms.end_height) : null,
				offset_start: terms.start_offset ? Number(terms.start_offset) : null,
				offset_end: terms.end_offset ? Number(terms.end_offset) : null,
			},
			location: {
				block_height: Number(etching_height),
				tx_id: etching_tx,
			},
			supply: {
				current: BigInt(circulating_supply),
				total_mints: mints.toString(),
				premine: BigInt(premine ?? 0),
			},
		};
	}

	async getRuneBalance(
		network: BitcoinNetwork,
		address: string,
		runeId: string,
	): Promise<RuneBalanceResponse> {
		const { data } = await this.client.GET(
			"/addresses/{address}/runes/{rune}",
			{
				baseUrl: this.getApURL(network),
				params: {
					path: {
						address,
						rune: runeId,
					},
				},
			},
		);

		if (!data?.data) {
			return {
				address,
				balance: BigInt(0),
			};
		}

		return {
			address,
			balance: BigInt(data.data[0].rune_amount),
		};
	}

	async getRunes(
		network: BitcoinNetwork,
		address: string,
		params?: { limit?: number; offset?: number },
	): Promise<RunesResponse> {
		const { data } = await this.client.GET("/addresses/{address}/runes", {
			baseUrl: this.getApURL(network),
			params: {
				path: {
					address,
				},
				query: {
					include_info: true,
				},
			},
		});

		if (!data?.data) {
			return {
				limit: 0,
				offset: 0,
				total: 0,
				results: [],
			};
		}

		const response = data.data as unknown as Record<
			string,
			{
				amount: string;
				id: string;
				info?: null | components["schemas"]["RuneInfoBrief"];
			}
		>;

		const results: RunesResponse["results"] = Object.keys(response).map(
			(runeId) => ({
				rune: {
					id: response[runeId].id,
					name: response[runeId].info?.name || "Unknown",
					spaced_name: response[runeId].info?.spaced_name || "Unknown",
				},
				address,
				balance: BigInt(response[runeId].amount),
			}),
		);

		return {
			limit: 0,
			offset: 0,
			total: results.length,
			results,
		};
	}

	async getRuneUTXOs(
		network: BitcoinNetwork,
		address: string,
		runeId: string,
	): Promise<RuneUTXO[]> {
		const { data } = await this.client.GET(
			"/mempool/addresses/{address}/runes/utxos",
			{
				baseUrl: this.getApURL(network),
				params: {
					path: {
						address,
					},
					query: {
						rune: runeId,
					},
				},
			},
		);

		if (!data?.data) {
			return [];
		}

		return data.data.map((it) => ({
			height: it.height,
			address: address,
			txid: it.txid,
			vout: it.vout,
			satoshis: Number.parseInt(it.satoshis, 10),
			runes: it.runes.map((rune) => ({
				runeid: rune.rune_id,
				amount: BigInt(rune.amount),
			})),
		}));
	}

	async getUTXOs(network: BitcoinNetwork, address: string): Promise<UTXO[]> {
		const { data } = await this.client.GET("/addresses/{address}/utxos", {
			baseUrl: this.getApURL(network),
			params: {
				path: {
					address,
				},
				query: {
					exclude_metaprotocols: true,
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
		const { data } = await this.client.GET("/rpc/block/latest/height", {
			baseUrl: this.getApURL(network),
		});

		if (typeof data?.data !== "number") {
			throw new Error("Failed to fetch block height.");
		}

		return data.data;
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
		const { data } = await this.client.GET("/rpc/transaction/{tx_hash}/hex", {
			baseUrl: this.getApURL(network),
			params: {
				path: {
					tx_hash: txid,
				},
			},
		});

		if (!data?.data) {
			throw new Error(`Transaction ${txid} not found.`);
		}

		return data.data;
	}

	private getApURL(network: BitcoinNetwork): string {
		const url = this.rpcUrl[network.id];

		if (!url) {
			throw new Error(`No RPC URL configured for network ${network.id}`);
		}

		return url;
	}
}

class MaestroAPIError extends Error {
	constructor(
		message: string,
		public status: number,
	) {
		super(message);
		this.name = "MaestroAPIError";
	}
}
