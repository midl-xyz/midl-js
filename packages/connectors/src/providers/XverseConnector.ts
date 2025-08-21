import type { NetworkConfig } from "@midl/core";
import { BitcoinNetworkType, request } from "sats-connect";
import { SatsConnectConnector } from "~/providers/SatsConnectConnector";

export class XverseConnector extends SatsConnectConnector {
	async addNetwork({
		network,
		name,
		rpcUrl,
		indexerUrl,
	}: NetworkConfig): Promise<void> {
		if (network !== "regtest") {
			throw new Error("Xverse only supports adding regtest network");
		}

		const params = {
			name,
			chain: "bitcoin",
			rpcUrl,
			indexerUrl,
			type: BitcoinNetworkType.Regtest,
		};

		const permissionsRequest = await request(
			"wallet_requestPermissions",
			null,
			this.providerId,
		);

		if (permissionsRequest.status !== "success") {
			throw new Error("Failed to request permissions for adding network");
		}

		const response = await request(
			// biome-ignore lint/suspicious/noExplicitAny: this api is not yet typed
			"wallet_addNetwork" as any,
			params,
			this.providerId,
		);

		if (response.status === "success") {
			// Second attempts to switch to the network
			await request(
				// biome-ignore lint/suspicious/noExplicitAny: this api is not yet typed
				"wallet_addNetwork" as any,
				params,
				this.providerId,
			);
		} else {
			throw response.error;
		}
	}
}
