import ecc from "@bitcoinerlab/secp256k1";
import * as bip322 from "bip322-js";
import * as bitcoin from "bitcoinjs-lib";
import { Psbt } from "bitcoinjs-lib";
import bitcoinMessage from "bitcoinjs-message";
import type { ECPairInterface } from "ecpair";
import {
	type SignMessageParams,
	SignMessageProtocol,
	type SignMessageResponse,
	type SignPSBTParams,
} from "~/actions";
import {
	type Account,
	type ConnectParams,
	type Connector,
	type CreateConnectorConfig,
	createConnector,
} from "~/connectors/createConnector";
import { AddressPurpose, AddressType } from "~/constants";
import type { BitcoinNetwork } from "~/createConfig";
import { extractXCoordinate, getAddressType, isCorrectAddress } from "~/utils";

bitcoin.initEccLib(ecc);

type KeyPairConnectorParams = {
	keyPair: ECPairInterface;
};

class KeyPairConnector implements Connector {
	public readonly id = "keyPair";
	public readonly name = "KeyPair";

	constructor(
		private config: CreateConnectorConfig,
		private keyPair: ECPairInterface,
	) {}
	async connect({ purposes }: ConnectParams): Promise<Account[]> {
		const bitcoinNetwork = bitcoin.networks[this.config.network.network];
		const accounts: Account[] = [];

		if (purposes.includes(AddressPurpose.Ordinals)) {
			const p2tr = bitcoin.payments.p2tr({
				internalPubkey: Buffer.from(
					extractXCoordinate(this.keyPair.publicKey.toString("hex")),
					"hex",
				),
				network: bitcoinNetwork,
			});

			accounts.push({
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				address: p2tr.address!,
				purpose: AddressPurpose.Ordinals,
				publicKey: this.keyPair.publicKey.toString("hex"),
				addressType: AddressType.P2TR,
			});
		}

		if (purposes.includes(AddressPurpose.Payment)) {
			const p2sh = bitcoin.payments.p2sh({
				redeem: bitcoin.payments.p2wpkh({
					pubkey: this.keyPair.publicKey,
					network: bitcoinNetwork,
				}),
				network: bitcoinNetwork,
			});

			accounts.push({
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				address: p2sh.address!,
				purpose: AddressPurpose.Payment,
				publicKey: this.keyPair.publicKey.toString("hex"),
				addressType: AddressType.P2SH,
			});
		}

		this.config.setState({
			connection: this.id,
			publicKey: this.keyPair.publicKey.toString("hex"),
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
	async getNetwork(): Promise<BitcoinNetwork> {
		return this.config.getState().network;
	}
	async signMessage(params: SignMessageParams): Promise<SignMessageResponse> {
		if (!this.keyPair.privateKey) {
			throw new Error("No private key");
		}

		switch (params.protocol) {
			case SignMessageProtocol.Bip322: {
				const signature = bip322.Signer.sign(
					this.keyPair.toWIF(),
					params.address,
					params.message,
				);

				return {
					signature: signature.toString("hex"),
					address: params.address,
				};
			}

			case SignMessageProtocol.Ecdsa: {
				const signature = bitcoinMessage.sign(
					params.message,
					this.keyPair.privateKey,
					this.keyPair.compressed,
					{ segwitType: "p2sh(p2wpkh)" },
				);

				return {
					signature: signature.toString("base64"),
					address: params.address,
				};
			}

			default:
				throw new Error("Unsupported protocol");
		}
	}
	async signPSBT({
		psbt: psbtData,
		signInputs,
		disableTweakSigner,
	}: Omit<SignPSBTParams, "publish">) {
		const psbt = Psbt.fromBase64(psbtData);

		for (const [address, inputs] of Object.entries(signInputs)) {
			const type = getAddressType(address);

			switch (type) {
				case AddressType.P2SH: {
					for (const input of inputs) {
						psbt.signInput(input, this.keyPair);
					}
					break;
				}

				case AddressType.P2TR: {
					for (const input of inputs) {
						const signer = this.keyPair.tweak(
							Buffer.from(
								bitcoin.crypto.taggedHash(
									"TapTweak",
									Buffer.from(
										extractXCoordinate(this.keyPair.publicKey.toString("hex")),
										"hex",
									),
								),
							),
						);

						psbt.signInput(input, disableTweakSigner ? this.keyPair : signer);
					}
					break;
				}
			}
		}

		return {
			psbt: psbt.toBase64(),
		};
	}
}

export const keyPair = ({ keyPair }: KeyPairConnectorParams) =>
	createConnector((config) => {
		return new KeyPairConnector(config, keyPair);
	});
