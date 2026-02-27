import createClient, { type Client } from "openapi-fetch";
import { logger } from "~/config";
import type { BitcoinNetwork } from "~/createConfig";
import type {
	AbstractRunesProvider,
	RuneBalanceResponse,
	RuneResponse,
	RunesResponse,
	RuneUTXO,
} from "~/providers/runes/AbstractRunesProvider";
import type { paths } from "~/providers/runes/scheme/maestro-symphony";

type MaestroSymphonyRPC = Partial<Record<BitcoinNetwork["id"], string>>;

export const maestroSymphonyRPC: MaestroSymphonyRPC = {
	regtest: "https://runes.staging.midl.xyz",
};

export class MaestroSymphonyProvider implements AbstractRunesProvider {
	private readonly client: Client<paths>;

	constructor(
		private readonly rpcUrlMap: MaestroSymphonyRPC = maestroSymphonyRPC,
	) {
		this.client = createClient<paths>();
	}

	async getRune(
		network: BitcoinNetwork,
		runeId: string,
	): Promise<RuneResponse> {
		const url = this.getApiURL(network);

		const { data } = await this.client.GET("/runes/{rune}", {
			baseUrl: url,
			params: {
				path: {
					rune: runeId,
				},
			},
		});

		if (!data || !data.data) {
			throw new Error(`Rune with ID ${runeId} not found.`);
		}

		const runeData = data.data;

		return {
			id: runeData.id,
			name: runeData.name,
			spaced_name: runeData.spaced_name,
			symbol: runeData.symbol ?? "¤",
			divisibility: runeData.divisibility,
			supply: {
				premine: BigInt(runeData.premine),
			},
		};
	}

	async getRuneBalance(
		network: BitcoinNetwork,
		address: string,
		runeId: string,
	): Promise<RuneBalanceResponse> {
		const url = this.getApiURL(network);

		const response = await this.client.GET(
			"/addresses/{address}/runes/balances/{rune}",
			{
				baseUrl: url,
				params: {
					path: {
						address,
						rune: runeId,
					},
				},
			},
		);

		if (!response.data) {
			throw new Error(
				`Failed to fetch rune balance for address ${address} and rune ${runeId}.`,
			);
		}

		return {
			address,
			balance: BigInt(response.data.data),
		};
	}

	async getRunes(
		network: BitcoinNetwork,
		address: string,
		params?: { limit?: number; offset?: number },
	): Promise<RunesResponse> {
		const url = this.getApiURL(network);

		if (params?.limit || params?.offset) {
			logger.warn(
				"MaestroSymphonyProvider does not support pagination parameters. Ignoring limit and offset.",
			);
		}

		const response = await this.client.GET(
			"/addresses/{address}/runes/balances",
			{
				baseUrl: url,
				params: {
					query: {
						include_info: true,
					},
					path: { address },
				},
			},
		);

		if (!response.data) {
			throw new Error(`Failed to fetch runes for address ${address}.`);
		}
		return {
			total: response.data.data.length,
			limit: response.data.data.length,
			offset: 0,
			results: response.data.data.map((rune) => ({
				rune: {
					id: rune.id,
					name: rune.info?.name || "Unknown",
					spaced_name: rune.info?.spaced_name || "Unknown",
				},
				address,
				balance: BigInt(rune.amount),
			})),
		};
	}

	async getRuneUTXOs(
		network: BitcoinNetwork,
		address: string,
		runeId: string,
	): Promise<RuneUTXO[]> {
		const url = this.getApiURL(network);

		const response = await this.client.GET(
			"/addresses/{address}/runes/utxos/{rune}",
			{
				baseUrl: url,
				params: {
					path: {
						address,
						rune: runeId,
					},
				},
			},
		);

		if (!response.data) {
			throw new Error(
				`Failed to fetch rune UTXOs for address ${address} and rune ${runeId}.`,
			);
		}

		return response.data.data.map((utxo) => ({
			height: utxo.height,
			address,
			txid: utxo.tx_hash,
			vout: utxo.output_index,
			satoshis: Number.parseInt(utxo.satoshis, 10),
			runes: utxo.runes.map((rune) => ({
				runeid: rune.id,
				amount: BigInt(rune.amount),
			})),
		}));
	}

	private getApiURL(network: BitcoinNetwork) {
		const rpcURL = this.rpcUrlMap[network.id] || this.rpcUrlMap.regtest;

		if (!rpcURL) {
			throw new Error(`No RPC URL configured for network: ${network.id}`);
		}

		return rpcURL;
	}
}
