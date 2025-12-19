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
	private readonly connectionPromises: Partial<
		Record<BitcoinNetwork["id"], Promise<WebSocket>>
	> = {};
	private readonly listeners: Partial<
		Record<
			BitcoinNetwork["id"],
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			Partial<Record<Action, Array<(data: any) => void>>>
		>
	> = {};
	private readonly messageHandlers: Partial<
		Record<BitcoinNetwork["id"], (event: MessageEvent) => void>
	> = {};

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

		this.listeners[network.id] = this.listeners[network.id] || {};
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		this.listeners[network.id]![action] =
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			this.listeners[network.id]![action] || [];

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		this.listeners[network.id]![action]!.push(callback);

		if (!this.messageHandlers[network.id]) {
			const handler = (event: MessageEvent) => {
				const messageData = JSON.parse(event.data.toString());

				const messageDataKeys = Object.keys(messageData);
				if (messageDataKeys.length === 0) {
					return;
				}

				const act = messageToActionMap[messageDataKeys[0]];

				const listeners = this.listeners[network.id]?.[act as Action] || [];
				for (const listener of listeners) {
					listener(messageData);
				}
			};

			this.messageHandlers[network.id] = handler;
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
			const listeners = this.listeners[network.id]?.[action];
			if (listeners) {
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				this.listeners[network.id]![action] = listeners.filter(
					(listener) => listener !== callback,
				);

				// Check if there are any remaining listeners for this network
				let hasListeners = false;
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				for (const act in this.listeners[network.id]!) {
					if (
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						this.listeners[network.id]![act as Action]!.length > 0
					) {
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
		// If already connected, return existing connection
		if (this.ws[network.id]) {
			return this.ws[network.id] as WebSocket;
		}

		// If connection is in progress, wait for it
		if (this.connectionPromises[network.id]) {
			return this.connectionPromises[network.id] as Promise<WebSocket>;
		}

		const wsUrl = this.wsUrlMap[network.id];

		if (!wsUrl) {
			throw new Error(`WebSocket URL not defined for network ${network.id}`);
		}

		// Create connection promise
		const connectionPromise = new Promise<WebSocket>((resolve, reject) => {
			const ws = new WebSocket(wsUrl);

			ws.addEventListener("open", () => {
				this.ws[network.id] = ws;
				delete this.connectionPromises[network.id];
				resolve(ws);
			});

			ws.addEventListener("error", (event) => {
				delete this.connectionPromises[network.id];
				reject(new Error("WebSocket connection failed"));
			});

			ws.addEventListener("close", () => {
				delete this.ws[network.id];
				delete this.connectionPromises[network.id];
				delete this.messageHandlers[network.id];
			});
		});

		this.connectionPromises[network.id] = connectionPromise;
		return connectionPromise;
	}

	private disconnect(network: BitcoinNetwork): void {
		const ws = this.ws[network.id];
		if (ws) {
			// Remove message handler before closing
			const handler = this.messageHandlers[network.id];
			if (handler) {
				ws.removeEventListener("message", handler);
				delete this.messageHandlers[network.id];
			}

			ws.close();
			delete this.ws[network.id];
			delete this.connectionPromises[network.id];
		}
	}
}
