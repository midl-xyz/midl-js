import * as ecc from "@bitcoinerlab/secp256k1";
import {
	AddressPurpose,
	type Config,
	SignMessageProtocol,
	broadcastTransaction,
	createConfig,
	keyPair,
	regtest,
} from "@midl-xyz/midl-js-core";
import type { TransactionIntention } from "@midl-xyz/midl-js-executor";
import {
	addTxIntention,
	clearTxIntentions,
	finalizeBTCTransaction,
	getEVMAddress,
	getPublicKey,
	midlRegtest,
	signIntention,
} from "@midl-xyz/midl-js-executor";
import type { MidlContextState } from "@midl-xyz/midl-js-react";
import BIP32Factory from "bip32";
import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import {
	type Chain,
	type TransactionSerializableBTC,
	type WalletClient,
	createWalletClient,
	encodeDeployData,
	getContractAddress,
	http,
} from "viem";
import { type StoreApi, createStore } from "zustand";

const bip32 = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc);

export class MidlHardhatEnvironment {
	private readonly config: Config;
	private readonly store: StoreApi<MidlContextState> =
		createStore<MidlContextState>()(() => ({
			intentions: [],
		}));

	private readonly deploymentsPath: string;

	private walletClient: WalletClient | undefined;

	constructor(private readonly hre: HardhatRuntimeEnvironment) {
		const keys = this.getKeyPair();

		this.config = createConfig({
			networks: [regtest],
			connectors: [keyPair({ keyPair: keys })],
		});

		this.deploymentsPath = this.hre.userConfig.midl.path;
	}

	public async initialize() {
		const accounts = await this.config.connectors[0].connect({
			purposes: [AddressPurpose.Ordinals],
		});

		clearTxIntentions(this.store);

		console.log(
			"Initialized with addresses:",
			accounts.map((it) => it.address).join(", "),
		);
	}

	public async getAddress() {
		if (!this.config.currentConnection) {
			throw new Error("connection is not defined");
		}

		const [account] = await this.config.currentConnection.getAccounts();
		const publicKey = getPublicKey(this.config, account.publicKey);

		if (!publicKey) {
			throw new Error("public key is not defined");
		}

		return getEVMAddress(publicKey);
	}

	public async deploy(
		name: string,
		options: Pick<
			TransactionSerializableBTC,
			"to" | "value" | "gasPrice" | "gas" | "nonce"
			// biome-ignore lint/suspicious/noExplicitAny: Allow any args
		> & { args: any },
		intentionOptions: Pick<
			TransactionIntention,
			| "value"
			| "hasDeposit"
			| "hasRunesDeposit"
			| "hasRunesWithdraw"
			| "hasWithdraw"
			| "rune"
		>,
	) {
		const data = await this.hre.artifacts.readArtifact(name);
		const deployData = encodeDeployData({
			abi: data.abi,
			args: options.args,
			bytecode: data.bytecode as `0x${string}`,
		});

		await addTxIntention(this.config, this.store, {
			evmTransaction: {
				type: "btc",
				chainId: 777,
				data: deployData,
			},
			...intentionOptions,
		});
	}

	public async execute() {
		const intentions = this.store.getState().intentions;

		if (!intentions || intentions.length === 0) {
			throw new Error("No intentions to execute");
		}

		const walletClient = await this.getWalletClient();

		const tx = await finalizeBTCTransaction(
			this.config,
			this.store,
			walletClient,
			{
				feeRateMultiplier: 4,
			},
		);

		for (const intention of intentions) {
			const signed = await signIntention(
				this.config,
				this.store,
				walletClient,
				intention,
				{
					gasPrice: 1000n,
					txId: tx.tx.id,
					protocol: SignMessageProtocol.Bip322,
				},
			);

			console.log(
				"Contract address",
				getContractAddress({
					from: await this.getAddress(),
					nonce: BigInt(intention.evmTransaction.nonce ?? 0),
				}),
			);

			const txId = await walletClient.sendRawTransaction({
				serializedTransaction: signed,
			});

			console.log("Transaction sent", txId);
		}

		await broadcastTransaction(this.config, tx.tx.hex);
		clearTxIntentions(this.store);
	}

	private getKeyPair() {
		const {
			midl: { mnemonic },
		} = this.hre.userConfig;

		if (!bip39.validateMnemonic(mnemonic)) {
			throw new Error("mnemonic is invalid");
		}

		const seed = bip39.mnemonicToSeedSync(mnemonic);
		const root = bip32.fromSeed(seed, bitcoin.networks.regtest);
		const child = root.derivePath("m/86'/1'/0'/0/0");

		// biome-ignore lint/style/noNonNullAssertion: Private key is always defined
		return ECPair.fromWIF(child.toWIF()!, bitcoin.networks.regtest);
	}

	private async getWalletClient(): Promise<WalletClient> {
		if (!this.walletClient) {
			this.walletClient = createWalletClient({
				chain: midlRegtest as Chain,
				// account: await this.getAddress(),
				transport: http(midlRegtest.rpcUrls.default.http[0]),
			});
		}

		return this.walletClient;
	}
}
