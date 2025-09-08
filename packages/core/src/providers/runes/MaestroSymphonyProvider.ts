import createClient, { type Client } from "openapi-fetch";
import type { BitcoinNetwork } from "~/createConfig";
import type {
	AbstractRunesProvider,
	RuneBalanceResponse,
	RuneResponse,
	RuneUTXO,
	RunesResponse,
} from "~/providers/runes/AbstractRunesProvider";
import type { paths } from "~/providers/runes/scheme/maestro-symphony";

type MaestroSymphonyRPC = Partial<Record<BitcoinNetwork["id"], string>>;

export const maestroSymphonyRPC: MaestroSymphonyRPC = {
	regtest: "https://runes.regtest.midl.xyz",
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

		const { data } = await this.client.POST("/runes/info", {
			baseUrl: url,
			body: [runeId],
		});

		if (!data || !data.data || !data.data[runeId]) {
			throw new Error(`Rune with ID ${runeId} not found.`);
		}

		const runeData = data.data[runeId];

		return {
			id: runeData.id,
			name: runeData.name,
			spaced_name: runeData.spaced_name,
			symbol: runeData.symbol ?? "¤",
			divisibility: runeData.divisibility,
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

		const response = await this.client.GET(
			"/addresses/{address}/runes/balances",
			{
				baseUrl: url,
				address,
				params: {
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
					name: "Symphony doesn't provide rune name", // TODO: check if name is always present
					spaced_name: "Symphony doesn't provider rune name", // TODO: check if spaced_name is always present
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
