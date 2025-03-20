import { MessageSigningProtocols, request } from "sats-connect";
import {
	type SignMessageParams,
	SignMessageProtocol,
	type SignMessageResponse,
} from "~/actions";
import type { SignPSBTParams, SignPSBTResponse } from "~/actions/signPSBT";
import {
	type Account,
	type ConnectorConnectParams,
	type Connector,
	ConnectorType,
} from "~/connectors/createConnector";
import { getAddressType } from "~/utils";

export class SatsConnectConnector implements Connector {
	public readonly id: string;
	public readonly type = ConnectorType.SatsConnect;

	constructor(
		public readonly providerId?: string,
		public readonly name = "SatsConnect",
	) {
		this.id = `sats-connect-${providerId ?? "default"}`;
	}

	async connect({ purposes }: ConnectorConnectParams) {
		const data = await request(
			"wallet_connect",
			{
				addresses: purposes,
			},
			this.providerId,
		);

		if (data.status === "error") {
			throw data.error;
		}

		const accounts = data.result.addresses.map(({ walletType, ...account }) => {
			return {
				...account,
				addressType: getAddressType(account.address),
			};
		}) as Account[];

		return accounts;
	}

	async beforeDisconnect() {
		await request("wallet_renouncePermissions", undefined, this.providerId);
	}

	async signMessage({
		address,
		message,
		protocol,
	}: SignMessageParams): Promise<SignMessageResponse> {
		const response = await request(
			"signMessage",
			{
				address,
				message,
				protocol:
					protocol === SignMessageProtocol.Ecdsa
						? MessageSigningProtocols.ECDSA
						: MessageSigningProtocols.BIP322,
			},
			this.providerId,
		);

		if (response.status === "error") {
			throw response.error;
		}

		return {
			signature: response.result.signature,
			address: response.result.address,
		};
	}

	async signPSBT({
		psbt,
		signInputs,
	}: SignPSBTParams): Promise<SignPSBTResponse> {
		const response = await request(
			"signPsbt",
			{
				psbt: psbt,
				signInputs,
			},
			this.providerId,
		);

		if (response.status === "error") {
			throw response.error;
		}

		return {
			psbt: response.result.psbt,
		};
	}
}
