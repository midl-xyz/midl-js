import ecc from "@bitcoinerlab/secp256k1";
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
import type {
	Account,
	ConnectorConnectParams,
	Connector,
} from "~/connectors/createConnector";
import { AddressPurpose, AddressType } from "~/constants";
import type { BitcoinNetwork } from "~/createConfig";
import { extractXCoordinate, getAddressType } from "~/utils";
import { signBIP322Simple } from "~/utils/signBIP322Simple";

bitcoin.initEccLib(ecc);

export class KeyPairConnector implements Connector {
	public readonly id = "keyPair";
	public readonly name = "KeyPair";

	constructor(private keyPair: ECPairInterface) {}

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

		return accounts;
	}

	async signMessage(
		params: SignMessageParams,
		network: BitcoinNetwork,
	): Promise<SignMessageResponse> {
		if (!this.keyPair.privateKey) {
			throw new Error("No private key");
		}

		switch (params.protocol) {
			case SignMessageProtocol.Bip322: {
				const bitcoinNetwork = bitcoin.networks[network.network];

				const signature = signBIP322Simple(
					params.message,
					this.keyPair.toWIF(),
					params.address,
					bitcoinNetwork,
				);

				return {
					signature: signature as string,
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
