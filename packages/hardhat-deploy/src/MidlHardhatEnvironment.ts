import * as ecc from "@bitcoinerlab/secp256k1";
import {
	AddressPurpose,
	type Config,
	SignMessageProtocol,
	broadcastTransaction,
	createConfig,
	extractXCoordinate,
	keyPair,
	regtest,
	transferBTC,
} from "@midl-xyz/midl-js-core";
import type { TransactionIntention } from "@midl-xyz/midl-js-executor";
import {
	addTxIntention,
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

	private walletClient: WalletClient | undefined;

	constructor(private readonly hre: HardhatRuntimeEnvironment) {
		const keys = this.getKeyPair();

		this.config = createConfig({
			networks: [regtest],
			connectors: [keyPair({ keyPair: keys })],
		});
	}

	public async initialize() {
		const accounts = await this.config.connectors[0].connect({
			purposes: [AddressPurpose.Ordinals],
		});

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
		const walletClient = await this.getWalletClient();

		try {
			const data = await transferBTC(this.config, {
				transfers: [
					{
						amount: 50000,
						receiver:
							"bcrt1pzwvl8h8hl388nmdm53c0paqrshh6w6v3hy8mfxmt4zf0cljlf3ks8499zm",
					},
				],
				// from: "bcrt1puwn2akldaf2hqv64kmkjt3lgutk4se8rlmr8rcpk2v0ygg6zqqtqzzjdq9",
				feeRate: 4,
				publish: true,
			});
		} catch (e) {
			console.error(e);
			throw new Error("error transferring btc");
		}

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

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const [intention] = this.store.getState().intentions!;

		const tx = await finalizeBTCTransaction(
			this.config,
			this.store,
			walletClient,
			{
				feeRateMultiplier: 4,
			},
		);

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

		const sent = await walletClient.sendRawTransaction({
			serializedTransaction: signed,
		});

		console.log("Deploy tx evm", sent);

		try {
			await broadcastTransaction(this.config, tx.tx.hex);
		} catch (e) {
			console.log("error broadcasting tx");
			console.error(e);
		}

		console.log("deployed tx btc", tx.tx.id);

		// addTxIntention(this.config, this.store, args, false);
	}

	public execute() {}

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
