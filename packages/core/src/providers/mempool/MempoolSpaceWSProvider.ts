import type { BitcoinNetwork } from "~/createConfig";

type Action = "track-tx" | "blocks";

type ActionDataMap = {
	"track-tx": string;
	blocks: undefined;
};

type Block = {
	height: number;
};

type ActionResponseMap = {
	"track-tx": {
		txConfirmed: string;
	};
	blocks:
		| {
				block: Block;
		  }
		| { blocks: Block[] };
};

const messageToActionMap: Record<string, Action> = {
	txConfirmed: "track-tx",
	block: "blocks",
	blocks: "blocks",
};

export class MempoolSpaceWSProvider {
	private readonly ws: Partial<Record<BitcoinNetwork["id"], WebSocket>> = {};
	private readonly connectionPromises = new Map<
		BitcoinNetwork["id"],
		Promise<WebSocket>
	>();
	private readonly listeners = new Map<
		BitcoinNetwork["id"],
		Map<Action, Array<(data: unknown) => void>>
	>();
	private readonly messageHandlers = new Map<
		BitcoinNetwork["id"],
		(event: MessageEvent) => void
	>();

	constructor(
		private readonly wsUrlMap: Partial<Record<BitcoinNetwork["id"], string>>,
	) {}

	async subscribe<T extends Action>(
		network: BitcoinNetwork,
		action: T,
		data: ActionDataMap[T],
		callback: (data: ActionResponseMap[T]) => void,
	): Promise<() => void> {
		const ws = await this.connect(network);

		if (!this.listeners.has(network.id)) {
			this.listeners.set(network.id, new Map());
		}
		const networkListeners = this.listeners.get(network.id);
		if (!networkListeners) {
			throw new Error("Failed to initialize network listeners");
		}
		if (!networkListeners.has(action)) {
			networkListeners.set(action, []);
		}

		const actionListeners = networkListeners.get(action);
		if (!actionListeners) {
			throw new Error("Failed to initialize action listeners");
		}
		actionListeners.push(callback as (data: unknown) => void);

		if (!this.messageHandlers.has(network.id)) {
			const handler = (event: MessageEvent) => {
				const messageData = JSON.parse(event.data.toString());

				const messageDataKeys = Object.keys(messageData);
				if (messageDataKeys.length === 0) {
					return;
				}

				const act = messageToActionMap[messageDataKeys[0]];

				const listeners =
					this.listeners.get(network.id)?.get(act as Action) || [];
				for (const listener of listeners) {
					listener(messageData);
				}
			};

			this.messageHandlers.set(network.id, handler);
			ws.addEventListener("message", handler);
		}

		if (action === "blocks") {
			ws.send(JSON.stringify({ action: "want", data: ["blocks"] }));
		} else {
			ws.send(
				JSON.stringify({
					[action]: data,
				}),
			);
		}

		return () => {
			const networkListeners = this.listeners.get(network.id);
			const listeners = networkListeners?.get(action);
			if (listeners && networkListeners) {
				const filteredListeners = listeners.filter(
					(listener) => listener !== callback,
				);
				networkListeners.set(action, filteredListeners);

				let hasListeners = false;
				for (const [, actionListeners] of networkListeners) {
					if (actionListeners.length > 0) {
						hasListeners = true;
						break;
					}
				}

				if (!hasListeners) {
					this.disconnect(network);
				}
			}
		};
	}

	private async connect(network: BitcoinNetwork): Promise<WebSocket> {
		if (this.ws[network.id]) {
			return this.ws[network.id] as WebSocket;
		}

		const existingPromise = this.connectionPromises.get(network.id);
		if (existingPromise) {
			return existingPromise;
		}

		const wsUrl = this.wsUrlMap[network.id];

		if (!wsUrl) {
			throw new Error(`WebSocket URL not defined for network ${network.id}`);
		}

		const connectionPromise = new Promise<WebSocket>((resolve, reject) => {
			const ws = new WebSocket(wsUrl);

			ws.addEventListener("open", () => {
				this.ws[network.id] = ws;
				this.connectionPromises.delete(network.id);
				resolve(ws);
			});

			ws.addEventListener("error", (event) => {
				this.connectionPromises.delete(network.id);
				reject(new Error("WebSocket connection failed"));
			});

			ws.addEventListener("close", () => {
				delete this.ws[network.id];
				this.connectionPromises.delete(network.id);
				this.messageHandlers.delete(network.id);
			});
		});

		this.connectionPromises.set(network.id, connectionPromise);
		return connectionPromise;
	}

	private disconnect(network: BitcoinNetwork): void {
		const ws = this.ws[network.id];
		if (ws) {
			const handler = this.messageHandlers.get(network.id);
			if (handler) {
				ws.removeEventListener("message", handler);
				this.messageHandlers.delete(network.id);
			}

			ws.close();
			delete this.ws[network.id];
			this.connectionPromises.delete(network.id);
		}
	}
}
