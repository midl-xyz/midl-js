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
import { getAddressPurpose } from "~/utils/getAddressPurpose";

class UnisatConnector implements Connector {
	public readonly id = "unisat";
	public readonly name = "Unisat";
	public readonly type = ConnectorType.Unisat;

	constructor(private config: CreateConnectorConfig) {}

	async getNetwork() {
		return this.config.getState().network;
	}

	async connect(_params: ConnectParams): Promise<Account[]> {
		if (typeof window.unisat === "undefined") {
			throw new Error("Unisat not found");
		}

		const requestedAccounts = await window.unisat.requestAccounts();
		const publicKey = await window.unisat.getPublicKey();

		if (!publicKey) {
			throw new Error("Public key not found");
		}

		const accounts = requestedAccounts.map((it) => {
			return {
				address: it,
				publicKey: publicKey,
				purpose: getAddressPurpose(it, this.config.getState().network),
				addressType: getAddressType(it),
			};
		});

		this.config.setState({
			connection: this.id,
			publicKey: publicKey,
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

	async signMessage(params: SignMessageParams): Promise<SignMessageResponse> {
		if (typeof window.unisat === "undefined") {
			throw new Error("Unisat not found");
		}

		let type: "ecdsa" | "bip322-simple" = "ecdsa";

		switch (params.protocol) {
			case SignMessageProtocol.Ecdsa:
				type = "ecdsa";
				break;
			case SignMessageProtocol.Bip322:
				type = "bip322-simple";
				break;
			default:
				type = "ecdsa";
				break;
		}

		const signature = await window.unisat.signMessage(params.message, type);

		return {
			signature,
			address: params.address,
		};
	}

	async signPSBT({
		psbt,
		signInputs,
		disableTweakSigner,
	}: SignPSBTParams): Promise<SignPSBTResponse> {
		if (typeof window.unisat === "undefined") {
			throw new Error("Unisat not found");
		}

		const toSignInputs = Object.keys(signInputs).flatMap((address) =>
			signInputs[address].map((index) => ({
				address,
				index,
				disableTweakSigner: disableTweakSigner,
			})),
		);

		const signature = await window.unisat.signPsbt(psbt, {
			autoFinalized: false,
			toSignInputs,
		});

		const base64Psbt = Buffer.from(signature, "hex").toString("base64");

		return {
			psbt: base64Psbt,
		};
	}
}

export const unisat = () => {
	return createConnector((config) => {
		return new UnisatConnector(config);
	});
};
