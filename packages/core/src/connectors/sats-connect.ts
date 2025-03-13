import { MessageSigningProtocols, request } from "sats-connect";
import {
	type SignMessageParams,
	SignMessageProtocol,
	type SignMessageResponse,
} from "~/actions";
import type { SignPSBTParams, SignPSBTResponse } from "~/actions/signPSBT";
import {
	type Account,
	type ConnectParams,
	type Connector,
	ConnectorType,
	type CreateConnectorConfig,
	createConnector,
} from "~/connectors/createConnector";
import { getAddressType, isCorrectAddress } from "~/utils";

export class SatsConnectConnector implements Connector {
	public readonly id = "sats-connect";
	public readonly name = "Xverse";
	public readonly type = ConnectorType.SatsConnect;

	constructor(
		private config: CreateConnectorConfig,
		private providerId?: string,
	) {}

	async getNetwork() {
		return this.config.getState().network;
	}

	async connect({ purposes }: ConnectParams) {
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

		this.config.setState({
			connection: this.id,
			publicKey: data.result.addresses[0].publicKey,
			accounts,
		});

		return accounts;
	}

	async disconnect() {
		await request("wallet_renouncePermissions", undefined, this.providerId);

		this.config.setState({
			connection: undefined,
			publicKey: undefined,
		});
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

	async getAccounts(): Promise<Account[]> {
		const { connection, accounts, network } = this.config.getState();

		if (!connection) {
			throw new Error("Not connected");
		}

		if (!accounts) {
			throw new Error("No accounts");
		}

		for (const account of accounts as Account[]) {
			if (!isCorrectAddress(account.address, network)) {
				throw new Error("Invalid address network");
			}
		}

		return accounts as Account[];
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

export const satsConnect = () => {
	return createConnector((config) => {
		return new SatsConnectConnector(config);
	});
};
