import {
	type NetworkConfig,
	type SignMessageParams,
	SignMessageProtocol,
	type SignMessageResponse,
} from "@midl/core";
import {
	BitcoinNetworkType,
	MessageSigningProtocols,
	type SignMessageResult,
	request,
} from "sats-connect";
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

	async signMessages(
		messages: SignMessageParams[],
	): Promise<SignMessageResponse[]> {
		const response = await request(
			// biome-ignore lint/suspicious/noExplicitAny: This is experimental api
			"signMultipleMessages" as any,
			{
				messages: messages.map((it) => ({
					address: it.address,
					message: it.message,
					protocol:
						it.protocol === SignMessageProtocol.Ecdsa
							? MessageSigningProtocols.ECDSA
							: MessageSigningProtocols.BIP322,
				})),
			},
			this.providerId,
		);

		if (response.status === "success") {
			const signatures = response.result.signatures as SignMessageResult[];

			return signatures.map((it) => ({
				address: it.address,
				signature: it.signature,
				protocol:
					it.protocol === MessageSigningProtocols.ECDSA
						? SignMessageProtocol.Ecdsa
						: SignMessageProtocol.Bip322,
				messageHash: it.messageHash,
			}));
		}

		throw response.error;
	}
}
