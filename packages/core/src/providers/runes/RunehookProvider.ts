import createClient, { type Client } from "openapi-fetch";
import { parseUnits } from "viem";
import type { BitcoinNetwork } from "~/createConfig";
import type {
	AbstractRunesProvider,
	RuneBalanceResponse,
	RuneResponse,
	RuneUTXO,
	RunesResponse,
} from "~/providers/runes/AbstractRunesProvider";
import type { paths } from "~/providers/runes/scheme/runehook";

export const runehookRPC: Record<BitcoinNetwork["id"], string> = {
	mainnet: "https://mempool.space",
	testnet: "https://mempool.space/testnet",
	testnet4: "https://mempool.space/testnet4",
	regtest: "https://mempool.regtest.midl.xyz",
	signet: "https://mempool.space/signet",
};

export class RunehookProvider implements AbstractRunesProvider {
	private readonly client: Client<paths>;

	constructor(
		private readonly rpcUrlMap: Record<
			BitcoinNetwork["id"],
			string
		> = runehookRPC,
	) {
		this.client = createClient<paths>();
	}

	private getApURL(network: BitcoinNetwork) {
		return this.rpcUrlMap[network.id] || this.rpcUrlMap.mainnet;
	}

	async getRune(
		network: BitcoinNetwork,
		runeId: string,
	): Promise<RuneResponse> {
		const response = await this.client.GET("/runes/v1/etchings/{etching}", {
			baseUrl: this.getApURL(network),
			params: {
				path: {
					etching: runeId,
				},
			},
		});

		if (!response.data) {
			throw new Error(`Failed to fetch rune with ID ${runeId}`);
		}

		return {
			...response.data,
			supply: {
				premine: parseUnits(
					response.data.supply.premine,
					response.data.divisibility,
				),
			},
			mint_terms: response.data.mint_terms
				? {
						...response.data.mint_terms,
						amount: response.data.mint_terms.amount
							? parseUnits(
									response.data.mint_terms.amount,
									response.data.divisibility,
								)
							: null,
						cap: response.data.mint_terms.cap
							? parseUnits(
									response.data.mint_terms.cap,
									response.data.divisibility,
								)
							: null,
					}
				: undefined,
		};
	}
	async getRuneBalance(
		network: BitcoinNetwork,
		address: string,
		runeId: string,
	): Promise<RuneBalanceResponse> {
		const response = await this.client.GET(
			"/runes/v1/etchings/{etching}/holders/{address}",
			{
				baseUrl: this.getApURL(network),
				params: {
					path: {
						etching: runeId,
						address,
					},
				},
			},
		);

		if (!response.data) {
			throw new Error("Failed to fetch rune balance");
		}

		const rune = await this.getRune(network, runeId);

		return {
			...response.data,
			balance: parseUnits(response.data.balance, rune.divisibility),
		};
	}

	async getRunes(
		network: BitcoinNetwork,
		address: string,
		{
			limit,
			offset,
		}: {
			limit?: number;
			offset?: number;
		} = {
			limit: 20,
			offset: 0,
		},
	): Promise<RunesResponse> {
		const response = await this.client.GET(
			"/runes/v1/addresses/{address}/balances",
			{
				baseUrl: this.getApURL(network),
				params: {
					path: { address },
					query: { limit, offset },
				},
			},
		);

		if (!response.data) {
			throw new Error(`Failed to fetch runes for address ${address}`);
		}

		return {
			...response.data,
			results: response.data.results.map((rune) => ({
				...rune,
				address: address,
				balance: parseUnits(rune.balance, rune.rune.divisibility),
			})),
		};
	}
	async getRuneUTXOs(
		network: BitcoinNetwork,
		address: string,
		runeId: string,
	): Promise<RuneUTXO[]> {
		const url = `${this.getApURL(network)}/utxos/${address}?runeId=${runeId}`;
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch rune UTXOs: ${response.statusText}`);
		}

		type TxOutput = {
			txid: string;
			vout: number;
			address: string;
			scriptPk: string;
			satoshis: number;
			height: number;
			confirmations: number;
			runes: {
				runeid: string;
				rune: string;
				spacedRune: string;
				symbol: string;
				divisibility: number;
				amount: string;
			}[];
		};

		const data: TxOutput[] = await response.json();

		return data.map((utxo) => ({
			...utxo,
			runes: utxo.runes.map((rune) => ({
				...rune,
				amount: parseUnits(rune.amount, rune.divisibility),
			})),
		}));
	}
}
