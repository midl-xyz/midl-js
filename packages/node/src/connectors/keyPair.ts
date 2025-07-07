import ecc from "@bitcoinerlab/secp256k1";
import {
	type Account,
	AddressPurpose,
	AddressType,
	type BitcoinNetwork,
	type Connector,
	type ConnectorConnectParams,
	type CreateConnectorFn,
	type SignMessageParams,
	SignMessageProtocol,
	type SignMessageResponse,
	type SignPSBTParams,
	createConnector,
	extractXCoordinate,
	getAddressType,
} from "@midl-xyz/midl-js-core";
import * as bitcoin from "bitcoinjs-lib";
import { Psbt } from "bitcoinjs-lib";
import bitcoinMessage from "bitcoinjs-message";
import type { ECPairInterface } from "ecpair";
import { signBIP322Simple } from "~/utils";

bitcoin.initEccLib(ecc);

class KeyPairConnector implements Connector {
	public readonly id = "keyPair";

	constructor(
		private keyPair: ECPairInterface,
		private readonly paymentAddressType: AddressType = AddressType.P2WPKH,
	) {}

	async connect({
		purposes,
		network,
	}: ConnectorConnectParams): Promise<Account[]> {
		const bitcoinNetwork = bitcoin.networks[network.network];
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
			if (this.paymentAddressType === AddressType.P2SH_P2WPKH) {
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
					addressType: AddressType.P2SH_P2WPKH,
				});
			}

			if (this.paymentAddressType === AddressType.P2WPKH) {
				const p2wpkh = bitcoin.payments.p2wpkh({
					pubkey: this.keyPair.publicKey,
					network: bitcoinNetwork,
				});

				accounts.push({
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					address: p2wpkh.address!,
					purpose: AddressPurpose.Payment,
					publicKey: this.keyPair.publicKey.toString("hex"),
					addressType: AddressType.P2WPKH,
				});
			}
		}

		return accounts;
	}

	async signMessage(
		params: SignMessageParams,
		network: BitcoinNetwork,
	): Promise<SignMessageResponse> {
		if (!this.keyPair.privateKey) {
			throw new Error("No private key");
		}

		const addressType = getAddressType(params.address);

		switch (params.protocol) {
			case SignMessageProtocol.Bip322: {
				const signature = signBIP322Simple(
					params.message,
					this.keyPair.toWIF(),
					params.address,
					bitcoin.networks[network.network],
				);

				return {
					signature: signature as string,
					address: params.address,
					protocol: SignMessageProtocol.Bip322,
				};
			}

			case SignMessageProtocol.Ecdsa: {
				const signature = bitcoinMessage.sign(
					params.message,
					this.keyPair.privateKey,
					this.keyPair.compressed,
					{
						segwitType:
							addressType === AddressType.P2SH_P2WPKH
								? "p2sh(p2wpkh)"
								: "p2wpkh",
					},
				);

				return {
					signature: signature.toString("base64"),
					address: params.address,
					protocol: SignMessageProtocol.Ecdsa,
				};
			}

			default:
				throw new Error("Unsupported protocol");
		}
	}
	async signPSBT(
		{
			psbt: psbtData,
			signInputs,
			disableTweakSigner,
		}: Omit<SignPSBTParams, "publish">,
		network: BitcoinNetwork,
	) {
		const bitcoinNetwork = bitcoin.networks[network.network];

		const psbt = Psbt.fromBase64(psbtData, {
			network: bitcoinNetwork,
		});

		for (const [address, inputs] of Object.entries(signInputs)) {
			const type = getAddressType(address);

			switch (type) {
				case AddressType.P2SH_P2WPKH: {
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

export const keyPairConnector: CreateConnectorFn<{
	keyPair: ECPairInterface;
	paymentAddressType?: AddressType;
}> = ({ metadata, keyPair, paymentAddressType }) =>
	createConnector(
		{
			metadata: {
				name: "KeyPair",
			},
			create: () => new KeyPairConnector(keyPair, paymentAddressType),
		},
		metadata,
	);
