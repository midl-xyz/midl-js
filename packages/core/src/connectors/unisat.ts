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
import type { Unisat } from "~/types/unisat";
import { get, getAddressType } from "~/utils";
import { getAddressPurpose } from "~/utils/getAddressPurpose";

export class UnisatConnector implements Connector {
	public readonly type = ConnectorType.Unisat;

	constructor(
		public readonly id: string = "unisat",
		public readonly name: string = "Unisat",
	) {}

	async connect(params: ConnectorConnectParams): Promise<Account[]> {
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
				purpose: getAddressPurpose(it, params.network),
				addressType: getAddressType(it),
			};
		});

		return accounts;
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

	private getProvider() {
		const provider = get(window, this.id);

		if (typeof provider === "undefined") {
			throw new Error("Unisat not found");
		}

		return provider as Unisat;
	}
}
