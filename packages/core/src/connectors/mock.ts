import * as bitcoin from "bitcoinjs-lib";
import { Psbt } from "bitcoinjs-lib";
import type { ECPairInterface } from "ecpair";
import type {
	SignMessageParams,
	SignMessageResponse,
	SignPSBTParams,
	SignPSBTResponse,
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
import { extractXCoordinate, isCorrectAddress } from "~/utils";
import * as ecc from "tiny-secp256k1";
import BIP32Factory from "bip32";

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

type MockConnectorParams = {
	keyPair: ECPairInterface;
};

class MockConnector implements Connector {
	public readonly id = "mock";
	public readonly name = "Mock";

	constructor(
		private config: CreateConnectorConfig,
		private keyPair: ECPairInterface,
	) {}
	async connect({ purposes }: ConnectParams): Promise<Account[]> {
		const bitcoinNetwork = bitcoin.networks[this.config.network.network];
		const accounts: Account[] = [];

		if (purposes.includes(AddressPurpose.Ordinals)) {
			const p2tr = bitcoin.payments.p2tr({
				pubkey: Buffer.from(
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
	async disconnect(): Promise<void> {
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
	signMessage(params: SignMessageParams): Promise<SignMessageResponse> {
		throw new Error("Method not implemented.");
	}
	async signPSBT(
		params: Omit<SignPSBTParams, "publish">,
	): Promise<Omit<SignPSBTResponse, "txId">> {
		const psbt = Psbt.fromBase64(params.psbt);
		const node = bip32.fromPrivateKey(
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			this.keyPair.privateKey!,
			Buffer.alloc(32),
		);

		const tweakedChildNode = node.tweak(
			bitcoin.crypto.taggedHash(
				"TapTweak",
				Buffer.from(
					extractXCoordinate(this.keyPair.publicKey.toString("hex")),
					"hex",
				),
			),
		);

		await psbt.signInputAsync(0, tweakedChildNode);

		return {
			psbt: psbt.toBase64(),
		};
	}
}

export const mock = ({ keyPair }: MockConnectorParams) =>
	createConnector((config) => {
		return new MockConnector(config, keyPair);
	});
