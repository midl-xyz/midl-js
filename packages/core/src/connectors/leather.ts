import { address, Psbt } from "bitcoinjs-lib";
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
import { AddressType } from "~/constants";
import { getAddressType, isCorrectAddress } from "~/utils";
import { getAddressPurpose } from "~/utils/getAddressPurpose";

class LeatherConnector implements Connector {
	public readonly id = "leather";
	public readonly name = "Leather";
	public readonly type = ConnectorType.Leather;

	constructor(private config: CreateConnectorConfig) {}

	async getNetwork() {
		return this.config.getState().network;
	}

	async connect(params: ConnectParams): Promise<Account[]> {
		if (typeof window.LeatherProvider === "undefined") {
			throw new Error("LeatherProvider not found");
		}

		const response = await window.LeatherProvider.request("getAddresses");

		if (!("result" in response)) {
			throw new Error("Invalid response");
		}

		const { purposes } = params;

		const accounts = response.result.addresses
			.filter((it) => it.symbol === "BTC")
			.map((it) => {
				return {
					address: it.address,
					publicKey: it.publicKey,
					purpose: getAddressPurpose(
						it.address,
						this.config.getState().network,
					),
					addressType: getAddressType(it.address),
				};
			})
			.filter((it) => purposes.includes(it.purpose));

		if (purposes.length > 0) {
			const missingPurpose = purposes.find((purpose) => {
				return !accounts.find((account) => account.purpose === purpose);
			});

			if (missingPurpose) {
				throw new Error(`Missing purpose: ${missingPurpose}`);
			}
		}

		this.config.setState({
			connection: this.id,
			publicKey: accounts[0].publicKey,
			accounts,
		});

		return accounts;
	}

	async disconnect() {
		this.config.setState({
			connection: undefined,
			publicKey: undefined,
		});
	}

	async getAccounts() {
		if (!this.config.getState().connection) {
			throw new Error("Not connected");
		}

		if (!this.config.getState().accounts) {
			throw new Error("No accounts");
		}

		for (const account of this.config.getState().accounts as Account[]) {
			if (!isCorrectAddress(account.address, this.config.getState().network)) {
				throw new Error("Invalid address network");
			}
		}

		return this.config.getState().accounts as Account[];
	}

	private getNetworkName() {
		const network = this.config.getState().network;

		switch (network.network) {
			case "bitcoin":
				return "mainnet";
			case "regtest":
				return "devnet";

			default:
				return network.network;
		}
	}

	async signMessage(params: SignMessageParams): Promise<SignMessageResponse> {
		if (typeof window.LeatherProvider === "undefined") {
			throw new Error("LeatherProvider not found");
		}

		if (params.protocol === SignMessageProtocol.Ecdsa) {
			throw new Error("Invalid protocol");
		}

		const response = await window.LeatherProvider.request("signMessage", {
			message: params.message,
			network: this.getNetworkName(),
			paymentType:
				getAddressType(params.address) === AddressType.P2TR ? "p2tr" : "p2wpkh",
		});

		if (!("result" in response)) {
			throw new Error("Invalid response");
		}

		return response.result;
	}

	async signPSBT({
		psbt,
		signInputs,
	}: SignPSBTParams): Promise<SignPSBTResponse> {
		if (typeof window.LeatherProvider === "undefined") {
			throw new Error("LeatherProvider not found");
		}

		const toSignInputs = Object.keys(signInputs).flatMap((address) => {
			return signInputs[address].map((inputIndex) => {
				return inputIndex;
			});
		});

		const response = await window.LeatherProvider.request("signPsbt", {
			hex: Psbt.fromBase64(psbt).toHex(),
			signInputs: toSignInputs,
			network: this.getNetworkName(),
		});

		if (!("result" in response)) {
			throw new Error("Invalid response");
		}

		const base64Psbt = Psbt.fromHex(response.result.hex).toBase64();

		return {
			psbt: base64Psbt,
		};
	}
}

export const leather = () => {
	return createConnector((config) => {
		return new LeatherConnector(config);
	});
};
