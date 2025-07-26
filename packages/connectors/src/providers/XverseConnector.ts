import type { Account, ConnectorConnectParams } from "@midl-xyz/midl-js-core";
import { BitcoinNetworkType, request } from "sats-connect";
import { SatsConnectConnector } from "~/providers/SatsConnectConnector";

export class XverseConnector extends SatsConnectConnector {
	async connect({
		purposes,
		network,
	}: ConnectorConnectParams): Promise<Account[]> {
		if (network.id === "regtest") {
			// TODO: These are temporary fixes for regtest network support in Xverse. We need to unify new network creation and switching logic across connectors.
			const params = {
				name: "MIDL Regtest",
				chain: "bitcoin",
				rpcUrl: "https://mempool.regtest.midl.xyz/api",
				indexerUrl: "https://api-regtest-midl.xverse.app",
				type: BitcoinNetworkType.Regtest,
			};

			try {
				// First adds network if not already added
				await request(
					// biome-ignore lint/suspicious/noExplicitAny: this api is not yet typed
					"wallet_addNetwork" as any,
					params,
					this.providerId,
				);

				// Second attempts to switch to the network
				await request(
					// biome-ignore lint/suspicious/noExplicitAny: this api is not yet typed
					"wallet_addNetwork" as any,
					params,
					this.providerId,
				);
			} catch (error) {
				console.error("Failed to add network:", error);
			}
		}

		return super.connect({ purposes, network });
	}
}
