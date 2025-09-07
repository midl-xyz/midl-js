import type { BitcoinNetwork } from "~/createConfig";
import type {
	AbstractRunesProvider,
	RuneBalanceResponse,
	RuneResponse,
	RuneUTXO,
	RunesResponse,
} from "~/providers/runes/AbstractRunesProvider";

export const runehookRPC: Record<BitcoinNetwork["id"], string> = {
	mainnet: "https://mempool.space",
	testnet: "https://mempool.space/testnet",
	testnet4: "https://mempool.space/testnet4",
	regtest: "https://mempool.regtest.midl.xyz",
	signet: "https://mempool.space/signet",
};

export class RunehookProvider implements AbstractRunesProvider {
	constructor(
		private readonly rpcUrlMap: Record<
			BitcoinNetwork["id"],
			string
		> = runehookRPC,
	) {}

	private getApURL(network: BitcoinNetwork) {
		return this.rpcUrlMap[network.id] || this.rpcUrlMap.mainnet;
	}

	async getRune(
		network: BitcoinNetwork,
		runeId: string,
	): Promise<RuneResponse> {
		const url = `${this.getApURL(network)}/runes/v1/etchings/${runeId}`;

		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch rune: ${response.statusText}`);
		}

		const rune: RuneResponse = await response.json();

		return rune;
	}
	async getRuneBalance(
		network: BitcoinNetwork,
		address: string,
		runeId: string,
	): Promise<RuneBalanceResponse> {
		const url = `${this.getApURL(network)}/runes/v1/etchings/${runeId}/holders/${address}`;
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch rune balance: ${response.statusText}`);
		}

		const data: RuneBalanceResponse = await response.json();
		return data;
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
		const url = `${this.getApURL(network)}/runes/v1/addresses/${address}/balances?limit=${limit}&offset=${offset}`;
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch runes: ${response.statusText}`);
		}

		const data: RunesResponse = await response.json();
		return data;
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

		const data: RuneUTXO[] = await response.json();
		return data;
	}
}
