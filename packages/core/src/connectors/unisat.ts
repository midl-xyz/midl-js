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
import { getAddressPurpose } from "~/utils/getAddressPurpose";

export class UnisatConnector implements Connector {
	public readonly id = "unisat";
	public readonly name = "Unisat";
	public readonly type = ConnectorType.Unisat;

	async connect(params: ConnectorConnectParams): Promise<Account[]> {
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
				purpose: getAddressPurpose(it, params.network),
				addressType: getAddressType(it),
			};
		});

		return accounts;
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
