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
import BIP32Factory from "bip32";
import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import { Psbt } from "bitcoinjs-lib";
import bitcoinMessage from "bitcoinjs-message";
import ECPairFactory from "ecpair";
import { derivationPathMap } from "~/config";
import { signBIP322Simple } from "~/utils";

const bip32 = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc);

bitcoin.initEccLib(ecc);

class KeyPairConnector implements Connector {
	public readonly id = "keyPair";
	private readonly seed: Buffer;
	private network: BitcoinNetwork | null = null;

	constructor(
		readonly mnemonic: string,
		private readonly paymentAddressType: AddressType,
		private readonly accountIndex: number = 0,
	) {
		if (!bip39.validateMnemonic(mnemonic)) {
			throw new Error("Invalid mnemonic");
		}

		this.seed = bip39.mnemonicToSeedSync(mnemonic);
	}

	async connect({
		purposes,
		network,
	}: ConnectorConnectParams): Promise<Account[]> {
		this.network = network;

		const bitcoinNetwork = bitcoin.networks[network.network];
		const accounts: Account[] = [];

		if (purposes.includes(AddressPurpose.Ordinals)) {
			const keyPair = this.deriveKeyPair(AddressType.P2TR);

			const p2tr = bitcoin.payments.p2tr({
				internalPubkey: Buffer.from(
					extractXCoordinate(keyPair.publicKey.toString("hex")),
					"hex",
				),
				network: bitcoinNetwork,
			});

			accounts.push({
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				address: p2tr.address!,
				purpose: AddressPurpose.Ordinals,
				publicKey: keyPair.publicKey.toString("hex"),
				addressType: AddressType.P2TR,
			});
		}

		if (purposes.includes(AddressPurpose.Payment)) {
			if (this.paymentAddressType === AddressType.P2SH_P2WPKH) {
				const keyPair = this.deriveKeyPair(AddressType.P2SH_P2WPKH);

				const p2sh = bitcoin.payments.p2sh({
					redeem: bitcoin.payments.p2wpkh({
						pubkey: keyPair.publicKey,
						network: bitcoinNetwork,
					}),
					network: bitcoinNetwork,
				});

				accounts.push({
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					address: p2sh.address!,
					purpose: AddressPurpose.Payment,
					publicKey: keyPair.publicKey.toString("hex"),
					addressType: AddressType.P2SH_P2WPKH,
				});
			}

			if (this.paymentAddressType === AddressType.P2WPKH) {
				const keyPair = this.deriveKeyPair(AddressType.P2WPKH);

				const p2wpkh = bitcoin.payments.p2wpkh({
					pubkey: keyPair.publicKey,
					network: bitcoinNetwork,
				});

				accounts.push({
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					address: p2wpkh.address!,
					purpose: AddressPurpose.Payment,
					publicKey: keyPair.publicKey.toString("hex"),
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
		const addressType = getAddressType(params.address);
		const keyPair = this.deriveKeyPair(addressType);

		if (!keyPair.privateKey) {
			throw new Error("No private key found in the derived key pair.");
		}

		switch (params.protocol) {
			case SignMessageProtocol.Bip322: {
				const signature = signBIP322Simple(
					params.message,
					keyPair.toWIF(),
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
					keyPair.privateKey,
					keyPair.compressed,
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
				case AddressType.P2WPKH: {
					const keyPair = this.deriveKeyPair(AddressType.P2WPKH);

					for (const input of inputs) {
						psbt.signInput(input, keyPair);
					}
					break;
				}
				case AddressType.P2SH_P2WPKH: {
					const keyPair = this.deriveKeyPair(AddressType.P2SH_P2WPKH);

					for (const input of inputs) {
						psbt.signInput(input, keyPair);
					}
					break;
				}

				case AddressType.P2TR: {
					for (const input of inputs) {
						const keyPair = this.deriveKeyPair(AddressType.P2TR);

						const signer = keyPair.tweak(
							Buffer.from(
								bitcoin.crypto.taggedHash(
									"TapTweak",
									Buffer.from(
										extractXCoordinate(keyPair.publicKey.toString("hex")),
										"hex",
									),
								),
							),
						);

						psbt.signInput(input, disableTweakSigner ? keyPair : signer);
					}
					break;
				}
			}
		}

		return {
			psbt: psbt.toBase64(),
		};
	}

	private deriveKeyPair(addressType: AddressType) {
		if (!this.network) {
			throw new Error("Network is not set. Call connect() first.");
		}

		const network = bitcoin.networks[this.network.network];
		const derivationPath = derivationPathMap[this.network.network][addressType];

		const root = bip32.fromSeed(this.seed, network);
		const child = root.derivePath(
			derivationPath.replace("ACCOUNT", this.accountIndex.toString()),
		);

		return ECPair.fromWIF(child.toWIF(), network);
	}
}

export const keyPairConnector: CreateConnectorFn<{
	mnemonic: string;
	paymentAddressType?: AddressType;
	accountIndex?: number;
}> = ({
	metadata,
	mnemonic,
	paymentAddressType = AddressType.P2WPKH,
	accountIndex = 0,
}) =>
	createConnector(
		{
			metadata: {
				name: "KeyPair",
			},
			create: () =>
				new KeyPairConnector(mnemonic, paymentAddressType, accountIndex),
		},
		metadata,
	);
