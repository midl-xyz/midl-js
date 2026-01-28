import {
	type Account,
	type Connector,
	type ConnectorConnectParams,
	type SignMessageParams,
	SignMessageProtocol,
	type SignMessageResponse,
	type SignPSBTParams,
	type SignPSBTResponse,
	get,
	getAddressPurpose,
	getAddressType,
} from "@midl/core";
import { hexToBytes } from "@noble/hashes/utils.js";
import { base64 } from "@scure/base";
import type { Unisat } from "~/types/unisat";

export class UnisatConnector implements Connector {
	constructor(public readonly id: string = "unisat") {}

	async connect(params: ConnectorConnectParams): Promise<Account[]> {
		const provider = this.getProvider();
		const requestedAccounts = await provider.requestAccounts();
		const publicKey = await provider.getPublicKey();

		if (!publicKey) {
			throw new Error("Public key not found");
		}

		// Treat single account request as a request for all purposes
		if (requestedAccounts.length === 1) {
			const accounts: Account[] = [];

			const [account] = requestedAccounts;

			for (const purpose of params.purposes) {
				accounts.push({
					address: account,
					publicKey: publicKey,
					purpose: purpose,
					addressType: getAddressType(account),
				});
			}

			return accounts;
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
			protocol: params.protocol ?? SignMessageProtocol.Ecdsa,
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

		const base64Psbt = base64.encode(hexToBytes(signature));

		return {
			psbt: base64Psbt,
		};
	}

	private getProvider(): Unisat {
		const provider = get(window, this.id);

		if (typeof provider === "undefined") {
			throw new Error("Unisat not found");
		}

		return provider as Unisat;
	}
}
