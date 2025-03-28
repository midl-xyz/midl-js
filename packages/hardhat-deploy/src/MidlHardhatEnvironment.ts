import * as ecc from "@bitcoinerlab/secp256k1";
import {
	AddressPurpose,
	type Config,
	KeyPairConnector,
	SignMessageProtocol,
	broadcastTransaction,
	connect,
	createConfig,
	regtest,
	waitForTransaction,
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
import fs from "node:fs";
import path from "node:path";
import {
	type Address,
	type Chain,
	type StateOverride,
	type TransactionSerializableBTC,
	type WalletClient,
	createWalletClient,
	encodeDeployData,
	encodeFunctionData,
	getContractAddress,
	http,
} from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { type StoreApi, createStore } from "zustand";
import "~/types/context";

const bip32 = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc);

export class MidlHardhatEnvironment {
	private readonly config: Config;
	private readonly store: StoreApi<MidlContextState> =
		createStore<MidlContextState>()(() => ({
			intentions: [],
		}));

	private readonly deploymentsPath: string;
	private readonly confirmationsRequired;
	private readonly btcConfirmationsRequired;

	private walletClient: WalletClient | undefined;

	constructor(private readonly hre: HardhatRuntimeEnvironment) {
		const keys = this.getKeyPair();

		this.config = createConfig({
			networks: [regtest],
			connectors: [new KeyPairConnector(keys)],
		});

		this.deploymentsPath = path.join(this.hre.config.paths.root, "deployments");
		this.confirmationsRequired =
			this.hre.userConfig.midl.confirmationsRequired ?? 5;
		this.btcConfirmationsRequired =
			this.hre.userConfig.midl.btcConfirmationsRequired ?? 1;

		if (!fs.existsSync(this.deploymentsPath)) {
			fs.mkdirSync(this.deploymentsPath);
		}
	}

	public async initialize() {
		await connect(this.config, {
			purposes: [AddressPurpose.Ordinals],
		});

		clearTxIntentions(this.store);
	}

	public async getAddress() {
		const { connection, accounts } = this.config.getState();

		if (!connection || !accounts) {
			throw new Error("connection is not defined");
		}

		const [account] = accounts;
		const publicKey = getPublicKey(this.config, account.publicKey);

		if (!publicKey) {
			throw new Error("public key is not defined");
		}

		return getEVMAddress(publicKey);
	}

	public async deploy(
		name: string,
		options?: Pick<
			TransactionSerializableBTC,
			"to" | "value" | "gasPrice" | "gas" | "nonce"
			// biome-ignore lint/suspicious/noExplicitAny: Allow any args
		> & { args?: any },
		intentionOptions: Pick<
			TransactionIntention,
			| "value"
			| "hasDeposit"
			| "hasRunesDeposit"
			| "hasRunesWithdraw"
			| "hasWithdraw"
			| "rune"
		> = {},
	) {
		const deployment = await this.getDeployment(name);

		if (deployment) {
			console.log("Contract already deployed", deployment.address);

			return deployment;
		}

		const data = await this.hre.artifacts.readArtifact(name);
		const deployData = encodeDeployData({
			abi: data.abi,
			args: options?.args,
			bytecode: data.bytecode as `0x${string}`,
		});

		await addTxIntention(this.config, this.store, {
			evmTransaction: {
				type: "btc",
				chainId: 777,
				data: deployData,
			},
			meta: {
				contractName: name,
			},
			...intentionOptions,
		});
	}

	public async getDeployment(name: string) {
		if (!fs.existsSync(`${this.deploymentsPath}/${name}.json`)) {
			return null;
		}

		const data = fs.readFileSync(`${this.deploymentsPath}/${name}.json`, {
			encoding: "utf-8",
		});

		if (!data) {
			return null;
		}

		const { abi } = await this.hre.artifacts.readArtifact(name);

		return JSON.parse(data) as {
			txId: string;
			address: string;
			abi: typeof abi;
		};
	}

	public async callContract(
		name: string,
		methodName: string,
		options: Pick<
			TransactionSerializableBTC,
			"to" | "value" | "gasPrice" | "gas" | "nonce"
			// biome-ignore lint/suspicious/noExplicitAny: Allow any args
		> & { args: any },
	) {
		const deployment = await this.getDeployment(name);

		if (!deployment) {
			throw new Error("Contract not deployed");
		}

		const { address, abi } = deployment;

		const method = abi.find((it: { name: string }) => it.name === methodName);

		if (!method) {
			throw new Error("Method not found");
		}

		const data = encodeFunctionData({
			abi,
			args: options.args,
			functionName: methodName,
		});

		await addTxIntention(this.config, this.store, {
			hasDeposit: Boolean(options.value && options.value > 0n),
			evmTransaction: {
				type: "btc",
				chainId: 777,
				data,
				to: address as Address,
				value: options.value,
				nonce: options.nonce,
				gasPrice: options.gasPrice,
				gas: options.gas,
			},
			value: options.value,
		});
	}

	public async execute({
		stateOverride,
		feeRateMultiplier = 4,
	}: { stateOverride?: StateOverride; feeRateMultiplier?: number } = {}) {
		const intentions = this.store.getState().intentions;

		if (!intentions || intentions.length === 0) {
			console.warn("No intentions to execute");

			return;
		}

		const walletClient = await this.getWalletClient();

		const tx = await finalizeBTCTransaction(
			this.config,
			this.store,
			walletClient,
			{
				stateOverride: stateOverride ?? [
					{
						address: await this.getAddress(),
						balance: intentions.reduce((acc, it) => acc + (it.value ?? 0n), 0n),
					},
				],
				feeRateMultiplier,
			},
		);

		const confirmationPromises: Promise<unknown>[] = [];

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

			const txId = await walletClient.sendRawTransaction({
				serializedTransaction: signed,
			});

			if (intention.meta?.contractName) {
				this.saveDeployment(intention.meta.contractName, {
					txId,
					address: getContractAddress({
						from: await this.getAddress(),
						nonce: BigInt(intention.evmTransaction.nonce ?? 0),
					}),
				});
			}

			confirmationPromises.push(
				waitForTransactionReceipt(walletClient, {
					hash: txId,
					confirmations: this.confirmationsRequired,
				}),
			);

			console.log("Transaction sent", txId);
		}

		const txId = await broadcastTransaction(this.config, tx.tx.hex);
		await waitForTransaction(this.config, txId, this.btcConfirmationsRequired);
		await Promise.all(confirmationPromises);

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

	private async saveDeployment(
		name: string,
		{
			txId,
			address,
		}: {
			txId: string;
			address: string;
		},
	) {
		const artifact = await this.hre.artifacts.readArtifact(name);

		fs.writeFileSync(
			`${this.deploymentsPath}/${name}.json`,
			JSON.stringify({
				txId,
				address,
				abi: artifact.abi,
			}),
		);
	}
}
