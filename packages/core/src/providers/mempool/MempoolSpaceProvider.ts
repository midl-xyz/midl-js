import type { BitcoinNetwork } from "~/createConfig";
import type {
	AbstractProvider,
	FeeRateResponse,
	TransactionStatusResponse,
	UTXO,
} from "~/providers/AbstractProvider";
import { MempoolSpaceWSProvider } from "~/providers/mempool/MempoolSpaceWSProvider";

type RPCUrlMap = Partial<Record<BitcoinNetwork["id"], string>>;

export const mempoolSpaceRPC: RPCUrlMap = {
	mainnet: "https://mempool.space",
	testnet: "https://mempool.space/testnet",
	testnet4: "https://mempool.space/testnet4",
	regtest: "https://mempool.staging.midl.xyz",
	signet: "https://mempool.space/signet",
};

export const mempoolSpaceWS: RPCUrlMap = {
	mainnet: "wss://mempool.space/api/v1/ws",
	testnet: "wss://mempool.space/testnet/api/v1/ws",
	testnet4: "wss://mempool.space/testnet4/api/v1/ws",
	regtest: "wss://mempool.staging.midl.xyz/api/v1/ws",
	signet: "wss://mempool.space/signet/api/v1/ws",
};

export class MempoolSpaceProvider implements AbstractProvider {
	private readonly wsProvider: MempoolSpaceWSProvider;

	constructor(
		private readonly rpcUrlMap: RPCUrlMap = mempoolSpaceRPC,
		private readonly wsUrlMap: RPCUrlMap = mempoolSpaceWS,
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
		requiredConfirmations = 1,
		options?: { timeoutMs?: number },
	): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			let timeout: NodeJS.Timeout | null = null;
			let txUnsubscribe: (() => void) | null = null;
			let blockUnsubscribe: (() => void) | null = null;

			const cleanup = () => {
				if (timeout) {
					clearTimeout(timeout);
				}
				txUnsubscribe?.();
				blockUnsubscribe?.();
			};

			timeout = options?.timeoutMs
				? setTimeout(() => {
						cleanup();
						reject(new Error("Timeout waiting for transaction confirmation"));
					}, options.timeoutMs)
				: null;

			this.wsProvider
				.subscribe(network, "track-tx", txid, async (data) => {
					try {
						if (data.txConfirmed) {
							const currentHeight = await this.getLatestBlockHeight(network);
							const txStatus = await this.getTransactionStatus(network, txid);

							const confirmations =
								txStatus.block_height !== null
									? currentHeight - txStatus.block_height + 1
									: 0;

							if (confirmations < requiredConfirmations) {
								blockUnsubscribe = await this.wsProvider.subscribe(
									network,
									"blocks",
									undefined,
									async (data) => {
										if (!("block" in data)) {
											return;
										}

										const confirmations =
											data.block.height - (txStatus.block_height || 0) + 1;
										if (confirmations >= requiredConfirmations) {
											cleanup();
											resolve(confirmations);
										}
									},
								);
							} else {
								cleanup();
								resolve(confirmations);
							}
						}
					} catch (error) {
						cleanup();
						reject(error);
					}
				})
				.then((unsubscribe) => {
					txUnsubscribe = unsubscribe;
				})
				.catch((error) => {
					cleanup();
					reject(error);
				});
		});
	}

	private getApURL(network: BitcoinNetwork) {
		if (!this.rpcUrlMap[network.id]) {
			throw new Error(`Unsupported network: ${network.id}`);
		}

		return this.rpcUrlMap[network.id];
	}
}
