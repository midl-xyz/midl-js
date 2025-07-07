import {
	type Account,
	type Connector,
	type ConnectorConnectParams,
	type SignMessageParams,
	SignMessageProtocol,
	type SignMessageResponse,
	type SignPSBTParams,
	type SignPSBTResponse,
	getAddressType,
} from "@midl-xyz/midl-js-core";
import { Psbt } from "bitcoinjs-lib";

export class PhantomConnector implements Connector {
	public readonly id = "phantom";
	async connect(params: ConnectorConnectParams): Promise<Account[]> {
		const provider = this.getProvider();

		const requestedAccounts = await provider.requestAccounts();
		const accounts = requestedAccounts
			.filter((it) => params.purposes.includes(it.purpose))
			.map((it) => {
				return {
					address: it.address,
					publicKey: it.publicKey,
					purpose: it.purpose,
					addressType: getAddressType(it.address),
				};
			});

		return accounts;
	}
	async signMessage(params: SignMessageParams): Promise<SignMessageResponse> {
		const provider = this.getProvider();

		if (params.protocol === SignMessageProtocol.Ecdsa) {
			throw new Error("Phantom does not support ECDSA signing");
		}

		const { signature } = await provider.signMessage(
			params.address,
			new TextEncoder().encode(params.message),
		);

		return {
			signature: Buffer.from(signature).toString("base64"),
			address: params.address,
			protocol: SignMessageProtocol.Bip322,
		};
	}

	async signPSBT({
		psbt,
		signInputs,
	}: Omit<SignPSBTParams, "publish">): Promise<Omit<SignPSBTResponse, "txId">> {
		const provider = this.getProvider();

		const signature = await provider.signPSBT(
			Psbt.fromBase64(psbt).toBuffer(),
			{
				inputsToSign: Object.keys(signInputs).map((address) => ({
					address: address,
					signingIndexes: signInputs[address],
				})),
			},
		);

		return {
			psbt: Psbt.fromBuffer(signature).toBase64(),
		};
	}

	private getProvider(): Phantom {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const provider = (window as any).phantom?.bitcoin as Phantom | undefined;

		if (!provider) {
			throw new Error("Phantom provider not found");
		}

		return provider;
	}
}
