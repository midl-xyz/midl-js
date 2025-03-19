import Wallet, { MessageSigningProtocols } from "sats-connect";
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
	public readonly id = "sats-connect";
	public readonly name = "Xverse";
	public readonly type = ConnectorType.SatsConnect;

	async connect({ purposes }: ConnectorConnectParams) {
		const data = await Wallet.request("wallet_connect", {
			addresses: purposes,
		});

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
		await Wallet.request("wallet_renouncePermissions", undefined);
	}

	async signMessage({
		address,
		message,
		protocol,
	}: SignMessageParams): Promise<SignMessageResponse> {
		const response = await Wallet.request("signMessage", {
			address,
			message,
			protocol:
				protocol === SignMessageProtocol.Ecdsa
					? MessageSigningProtocols.ECDSA
					: MessageSigningProtocols.BIP322,
		});

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
		const response = await Wallet.request("signPsbt", {
			psbt: psbt,
			signInputs,
		});

		if (response.status === "error") {
			throw response.error;
		}

		return {
			psbt: response.result.psbt,
		};
	}
}
