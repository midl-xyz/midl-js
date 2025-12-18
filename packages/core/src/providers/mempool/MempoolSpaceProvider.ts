import type { BitcoinNetwork } from "~/createConfig";
import type {
	AbstractProvider,
	FeeRateResponse,
	TransactionStatusResponse,
	UTXO,
} from "~/providers/AbstractProvider";
import { MempoolSpaceWSProvider } from "~/providers/mempool/MempoolSpaceWSProvider";

export const mempoolSpaceRPC: Record<Partial<BitcoinNetwork["id"]>, string> = {
	mainnet: "https://mempool.space",
	testnet: "https://mempool.space/testnet",
	testnet4: "https://mempool.space/testnet4",
	regtest: "https://mempool.regtest.midl.xyz",
	signet: "https://mempool.space/signet",
};

export const mempoolSpaceWS: Record<Partial<BitcoinNetwork["id"]>, string> = {
	mainnet: "wss://mempool.space/api/v1/ws",
	testnet: "wss://mempool.space/testnet/api/v1/ws",
	testnet4: "wss://mempool.space/testnet4/api/v1/ws",
	regtest: "wss://mempool.regtest.midl.xyz/api/v1/ws",
	signet: "wss://mempool.space/signet/api/v1/ws",
};

export class MempoolSpaceProvider implements AbstractProvider {
	private readonly wsProvider: MempoolSpaceWSProvider;

	constructor(
		private readonly rpcUrlMap: Record<
			Partial<BitcoinNetwork["id"]>,
			string
		> = mempoolSpaceRPC,
		private readonly wsUrlMap: Record<
			Partial<BitcoinNetwork["id"]>,
			string
		> = mempoolSpaceWS,
	) {
		this.wsProvider = new MempoolSpaceWSProvider(this.wsUrlMap);
	}

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

	async waitForTransaction(
		network: BitcoinNetwork,
		txid: string,
		options?: { timeoutMs?: number },
	): Promise<number> {
		const txPosition = await this.wsProvider.waitForTransaction(
			network,
			txid,
			options,
		);

		if (!txPosition.position?.block) {
			throw new Error(`Transaction ${txid} was not confirmed in a block.`);
		}

		return txPosition.position.block;
	}

	private getApURL(network: BitcoinNetwork) {
		if (!this.rpcUrlMap[network.id]) {
			throw new Error(`Unsupported network: ${network.id}`);
		}

		return this.rpcUrlMap[network.id];
	}
}
