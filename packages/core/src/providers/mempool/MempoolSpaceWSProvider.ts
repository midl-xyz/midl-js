import type { BitcoinNetwork } from "~/createConfig";

export type MempoolSpaceTxPosition = {
	txid?: string[];
	position?: {
		block: number;
		vsize: number;
	};
	[key: string]: unknown;
};

type MempoolSpaceWSIncoming = Record<string, unknown>;
type TrackTxHandler = (update: MempoolSpaceTxPosition) => void;

type ReconnectOptions = {
	baseDelayMs?: number;
	maxDelayMs?: number;
	maxJitterMs?: number;
};

export class MempoolSpaceWSProvider {
	private readonly trackedTxHandlers: Map<string, Set<TrackTxHandler>> =
		new Map();
	private ws: WebSocket | null = null;
	private connectedNetworkId: BitcoinNetwork["id"] | null = null;
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
	private reconnectAttempt = 0;
	private manuallyClosed = false;
	private readonly reconnectOptions: Required<ReconnectOptions>;

	constructor(
		private readonly wsUrlMap: Record<BitcoinNetwork["id"], string>,
		options: ReconnectOptions = {},
	) {
		this.reconnectOptions = {
			baseDelayMs: 500,
			maxDelayMs: 15_000,
			maxJitterMs: 250,
			...options,
		};
	}

	waitForTransaction = async (
		network: BitcoinNetwork,
		txid: string,
		{ timeoutMs = 15 * 60 * 1000 }: { timeoutMs?: number } = {},
	): Promise<MempoolSpaceTxPosition> => {
		return new Promise((resolve, reject) => {
			let timeout: ReturnType<typeof setTimeout> | null = null;
			const unsubscribe = this.trackTx(network, txid, (update) => {
				if (timeout) clearTimeout(timeout);
				unsubscribe();
				resolve(update);
			});

			if (timeoutMs > 0) {
				timeout = setTimeout(() => {
					unsubscribe();
					reject(
						new Error(`Timed out waiting for track-tx update for ${txid}`),
					);
				}, timeoutMs);
			}
		});
	};

	private trackTx(
		network: BitcoinNetwork,
		txid: string,
		handler: TrackTxHandler,
	): () => void {
		const handlers = this.trackedTxHandlers.get(txid) ?? new Set();
		handlers.add(handler);
		this.trackedTxHandlers.set(txid, handlers);

		this.ensureConnected(network);
		this.sendTrackTx(txid);

		return () => {
			const currentHandlers = this.trackedTxHandlers.get(txid);
			if (!currentHandlers) return;
			currentHandlers.delete(handler);
			if (currentHandlers.size === 0) {
				this.trackedTxHandlers.delete(txid);
			}
			this.disconnectIfIdle();
		};
	}

	disconnect = (): void => {
		this.manuallyClosed = true;
		this.clearReconnectTimer();
		this.reconnectAttempt = 0;

		if (this.ws) {
			try {
				this.ws.close();
			} catch {
				// ignore
			}
		}
		this.ws = null;
		this.connectedNetworkId = null;
	};

	private ensureConnected(network: BitcoinNetwork): void {
		if (!this.wsUrlMap[network.id]) {
			throw new Error(`Unsupported network: ${network.id}`);
		}

		this.manuallyClosed = false;

		if (this.ws && this.connectedNetworkId === network.id) {
			if (this.ws.readyState === WebSocket.OPEN) return;
			if (this.ws.readyState === WebSocket.CONNECTING) return;
		}

		this.internalClose(false);
		this.openSocket(network);
	}

	private openSocket(network: BitcoinNetwork): void {
		const wsUrl = this.wsUrlMap[network.id];
		this.connectedNetworkId = network.id;
		this.ws = new WebSocket(wsUrl);

		this.ws.onopen = () => {
			this.reconnectAttempt = 0;
			this.clearReconnectTimer();
			this.resubscribeAllTrackedTxs();
		};

		this.ws.onmessage = (event) => {
			this.handleMessage(event.data);
		};

		this.ws.onerror = () => {};

		this.ws.onclose = () => {
			this.ws = null;
			if (this.manuallyClosed) return;
			if (this.totalSubscriptionCount() === 0) return;
			this.scheduleReconnect(network);
		};
	}

	private handleMessage(raw: unknown): void {
		if (typeof raw !== "string") return;
		let msg: MempoolSpaceWSIncoming;
		try {
			msg = JSON.parse(raw);
		} catch {
			return;
		}

		if (
			"txPosition" in msg &&
			msg.txPosition &&
			typeof msg.txPosition === "object"
		) {
			const update = msg.txPosition as MempoolSpaceTxPosition;
			const txids = Array.isArray(update.txid) ? update.txid : [];
			for (const txid of txids) {
				this.emitTrackedTx(txid, update);
			}
			return;
		}

		if (
			"tracked-txs" in msg &&
			msg["tracked-txs"] &&
			typeof msg["tracked-txs"] === "object"
		) {
			const tracked = msg["tracked-txs"] as Record<string, unknown>;
			for (const [txid, entry] of Object.entries(tracked)) {
				if (!entry || typeof entry !== "object") continue;
				this.emitTrackedTx(txid, entry as MempoolSpaceTxPosition);
			}
		}
	}

	private emitTrackedTx(txid: string, update: MempoolSpaceTxPosition): void {
		const handlers = this.trackedTxHandlers.get(txid);
		if (!handlers) return;
		for (const handler of handlers) {
			try {
				handler(update);
			} catch {}
		}
	}

	private send(payload: unknown): void {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
		try {
			this.ws.send(JSON.stringify(payload));
		} catch {}
	}

	private sendTrackTx(txid: string): void {
		this.send({ "track-tx": txid });
	}

	private resubscribeAllTrackedTxs(): void {
		const txIds = [...this.trackedTxHandlers.keys()];
		if (txIds.length === 0) {
			this.disconnectIfIdle();
			return;
		}
		if (txIds.length === 1) {
			this.send({ "track-tx": txIds[0] });
			return;
		}
		this.send({ "track-txs": txIds });
	}

	private totalSubscriptionCount(): number {
		let total = 0;
		for (const handlers of this.trackedTxHandlers.values())
			total += handlers.size;
		return total;
	}

	private disconnectIfIdle(): void {
		if (this.totalSubscriptionCount() > 0) return;
		this.internalClose(true);
	}

	private internalClose(manual: boolean): void {
		this.clearReconnectTimer();
		this.reconnectAttempt = 0;
		this.manuallyClosed = manual;
		if (this.ws) {
			try {
				this.ws.close();
			} catch {
				// ignore
			}
		}
		this.ws = null;
		this.connectedNetworkId = null;
	}

	private scheduleReconnect(network: BitcoinNetwork): void {
		this.clearReconnectTimer();
		const { baseDelayMs, maxDelayMs, maxJitterMs } = this.reconnectOptions;
		const attempt = this.reconnectAttempt++;
		const exponential = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
		const jitter = Math.floor(Math.random() * maxJitterMs);
		const delay = exponential + jitter;

		this.reconnectTimer = setTimeout(() => {
			if (this.manuallyClosed) return;
			if (this.totalSubscriptionCount() === 0) return;
			this.openSocket(network);
		}, delay);
	}

	private clearReconnectTimer(): void {
		if (!this.reconnectTimer) return;
		clearTimeout(this.reconnectTimer);
		this.reconnectTimer = null;
	}
}
