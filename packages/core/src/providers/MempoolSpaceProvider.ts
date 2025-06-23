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

export const mempoolSpaceRPC: Record<BitcoinNetwork["id"], string> = {
	mainnet: "https://mempool.space",
	testnet: "https://mempool.space/testnet",
	testnet4: "https://mempool.space/testnet4",
	regtest: "https://mempool.regtest.midl.xyz",
};

export class MempoolSpaceProvider implements AbstractProvider {
	constructor(
		private readonly rpcUrlMap: Record<
			BitcoinNetwork["id"],
			string
		> = mempoolSpaceRPC,
	) {}

	async broadcastTransaction(
		network: BitcoinNetwork,
		txHex: string,
	): Promise<string> {
		const url = `${this.getApURL(network)}/api/tx`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "text/plain",
			},
			body: txHex,
		});

		if (!response.ok) {
			throw new Error(
				`Failed to broadcast transaction: ${response.statusText}`,
			);
		}

		return response.text();
	}
	async getLatestBlockHeight(network: BitcoinNetwork): Promise<number> {
		const url = `${this.getApURL(network)}/api/blocks/tip/height`;

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch block height: ${response.statusText}`);
		}

		const blockHeight: number = await response.json();

		return blockHeight;
	}
	async getFeeRate(network: BitcoinNetwork): Promise<FeeRateResponse> {
		const url = `${this.getApURL(network)}/api/v1/fees/recommended`;

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch fee rate: ${response.statusText}`);
		}

		const feeRate: FeeRateResponse = await response.json();

		return feeRate;
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
	async getTransactionStatus(
		network: BitcoinNetwork,
		txid: string,
	): Promise<TransactionStatusResponse> {
		const url = `${this.getApURL(network)}/api/tx/${txid}/status`;

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch transaction status: ${response.statusText}`,
			);
		}

		const data: TransactionStatusResponse = await response.json();
		return data;
	}
	async getTransactionHex(
		network: BitcoinNetwork,
		txid: string,
	): Promise<string> {
		const url = `${this.getApURL(network)}/api/tx/${txid}/hex`;

		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(
				`Failed to fetch transaction hex: ${response.statusText}`,
			);
		}

		const data: string = await response.text();
		return data;
	}
	async getUTXOs(network: BitcoinNetwork, address: string): Promise<UTXO[]> {
		const url = `${this.getApURL(network)}/api/address/${address}/utxo`;

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
