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
import type { Unisat } from "~/types/unisat";
import { get, getAddressType, isCorrectAddress } from "~/utils";
import { getAddressPurpose } from "~/utils/getAddressPurpose";

export class UnisatConnector implements Connector {
	public readonly type = ConnectorType.Unisat;

	constructor(
		private config: CreateConnectorConfig,
		public readonly id: string = "unisat",
		public readonly name: string = "Unisat",
	) {}

	async getNetwork() {
		return this.config.getState().network;
	}

	private getProvider() {
		const provider = get(window, this.id);

		if (typeof provider === "undefined") {
			throw new Error("Unisat not found");
		}

		return provider as Unisat;
	}

	async connect(_params: ConnectParams): Promise<Account[]> {
		const provider = this.getProvider();
		const requestedAccounts = await provider.requestAccounts();
		const publicKey = await provider.getPublicKey();

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
		const provider = this.getProvider();

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

		const signature = await provider.signMessage(params.message, type);

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
		const provider = this.getProvider();

		const toSignInputs = Object.keys(signInputs).flatMap((address) =>
			signInputs[address].map((index) => ({
				address,
				index,
				disableTweakSigner: disableTweakSigner,
			})),
		);

		const signature = await provider.signPsbt(psbt, {
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
