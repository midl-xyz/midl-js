import {
	AddressPurpose,
	type BitcoinNetwork,
	type Config,
	KeyPairConnector,
	SignMessageProtocol,
	broadcastTransaction,
	connect,
	createConfig,
	mainnet,
	regtest,
	testnet,
	testnet4,
	waitForTransaction,
} from "@midl-xyz/midl-js-core";
import type { TransactionIntention } from "@midl-xyz/midl-js-executor";
import {
	addTxIntention,
	clearTxIntentions,
	finalizeBTCTransaction,
	getEVMAddress,
	getEVMFromBitcoinNetwork,
	getPublicKeyForAccount,
	signIntention,
} from "@midl-xyz/midl-js-executor";
import type { MidlContextState } from "@midl-xyz/midl-js-react";

import {
	type Libraries,
	resolveBytecodeWithLinkedLibraries,
} from "@nomicfoundation/hardhat-viem/internal/bytecode";
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
import { Wallet } from "~/Wallet";

export class MidlHardhatEnvironment {
	private readonly store: StoreApi<MidlContextState> =
		createStore<MidlContextState>()(() => ({
			intentions: [],
		}));

	private readonly deploymentsPath: string;
	private readonly confirmationsRequired;
	private readonly btcConfirmationsRequired;

	private accountIndex = 0;

	private walletClient: WalletClient | undefined;

	public wallet: Wallet;
	private bitcoinNetwork: BitcoinNetwork;

	private config: Config | null = null;

	constructor(private readonly hre: HardhatRuntimeEnvironment) {
		this.bitcoinNetwork = regtest;
		this.initializeNetwork();

		this.deploymentsPath = path.join(
			this.hre.config.paths.root,
			this.hre.userConfig.midl.path ?? "deployments",
		);
		this.confirmationsRequired =
			this.hre.userConfig.midl.confirmationsRequired ?? 5;
		this.btcConfirmationsRequired =
			this.hre.userConfig.midl.btcConfirmationsRequired ?? 1;

		if (!fs.existsSync(this.deploymentsPath)) {
			fs.mkdirSync(this.deploymentsPath);
		}

		this.wallet = new Wallet(this.hre.userConfig.midl.mnemonic, regtest);
	}

	private initializeNetwork() {
		const networks = { regtest, mainnet, testnet4, testnet } as const;
		const network = this.hre.userConfig.midl.network;

		if (!network) {
			return;
		}

		if (typeof network === "string") {
			if (!(network in networks)) {
				throw new Error(`Network ${network} is not supported`);
			}

			this.bitcoinNetwork = networks[network as keyof typeof networks];
		} else {
			this.bitcoinNetwork = network;
		}
	}

	public async initialize(accountIndex = 0) {
		this.accountIndex = accountIndex;
		this.config = createConfig({
			networks: [this.bitcoinNetwork],
			connectors: [
				new KeyPairConnector(this.wallet.getAccount(this.accountIndex)),
			],
		});

		await connect(this.config, {
			purposes: [AddressPurpose.Ordinals],
		});

		clearTxIntentions(this.store);
	}

	public async deploy(
		name: string,
		options?: Pick<
			TransactionSerializableBTC,
			"to" | "value" | "gasPrice" | "gas" | "nonce"
			// biome-ignore lint/suspicious/noExplicitAny: Allow any args
		> & { args?: any; libraries?: Libraries<Address> },
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
		if (!this.config) {
			throw new Error("MidlHardhatEnvironment not initialized");
		}

		const deployment = await this.getDeployment(name);

		if (deployment) {
			console.log("Contract already deployed", deployment.address);

			return deployment;
		}

		const artifact = await this.hre.artifacts.readArtifact(name);
		const bytecode = await resolveBytecodeWithLinkedLibraries(
			artifact,
			options?.libraries ?? {},
		);

		const deployData = encodeDeployData({
			abi: artifact.abi,
			args: options?.args,
			bytecode: bytecode as `0x${string}`,
		});

		await addTxIntention(this.config, this.store, {
			evmTransaction: {
				type: "btc",
				chainId: 777,
				data: deployData,
				gas: options?.gas,
				gasPrice: options?.gasPrice,
				to: options?.to,
				value: options?.value,
				nonce: options?.nonce,
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
			address: Address;
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
		if (!this.config) {
			throw new Error("MidlHardhatEnvironment not initialized");
		}

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
				to: options.to ?? (address as Address),
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
		skipEstimateGasMulti = false,
	}: {
		stateOverride?: StateOverride;
		feeRateMultiplier?: number;
		skipEstimateGasMulti?: boolean;
	} = {}) {
		if (!this.config) {
			throw new Error("MidlHardhatEnvironment not initialized");
		}

		const intentions = this.store.getState().intentions;

		if (!intentions || intentions.length === 0) {
			console.warn("No intentions to execute");

			return;
		}

		const walletClient = await this.getWalletClient();
		const publicKey = await getPublicKeyForAccount(this.config);

		const tx = await finalizeBTCTransaction(
			this.config,
			this.store,
			walletClient,
			{
				stateOverride: stateOverride ?? [
					{
						address: getEVMAddress(publicKey),
						balance: intentions.reduce((acc, it) => acc + (it.value ?? 0n), 0n),
					},
				],
				feeRateMultiplier,
				skipEstimateGasMulti,
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
				const contractAddress = getContractAddress({
					from: getEVMAddress(publicKey),
					nonce: BigInt(intention.evmTransaction.nonce ?? 0),
				});

				this.saveDeployment(intention.meta.contractName, {
					txId,
					address: contractAddress,
				});

				console.log(
					`Contract ${intention.meta.contractName} will be deployed at`,
					contractAddress,
				);
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

		console.log("Transaction confirmed", txId);

		clearTxIntentions(this.store);
	}

	public async getWalletClient(): Promise<WalletClient> {
		if (!this.walletClient) {
			const chain = getEVMFromBitcoinNetwork(this.bitcoinNetwork);

			this.walletClient = createWalletClient({
				chain: chain as Chain,
				transport: http(chain.rpcUrls.default.http[0]),
			});
		}

		return this.walletClient;
	}

	public async save(
		name: string,
		{
			abi,
			txId,
			address,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			abi: any[];
			address: Address;
			txId?: string;
		},
	) {
		fs.writeFileSync(
			`${this.deploymentsPath}/${name}.json`,
			JSON.stringify({
				txId: txId ?? "",
				address,
				abi: abi,
			}),
		);
	}

	private async saveDeployment(
		name: string,
		{
			txId,
			address,
		}: {
			txId: string;
			address: Address;
		},
	) {
		const artifact = await this.hre.artifacts.readArtifact(name);

		this.save(name, {
			txId,
			address,
			abi: artifact.abi,
		});
	}

	/**
	 * @deprecated Use `wallet.getEVMAddress()` instead
	 */
	public getAddress() {
		console.warn(
			"getAddress is deprecated. Use wallet.getEVMAddress() instead",
		);

		return this.wallet.getEVMAddress(this.accountIndex);
	}

	public getConfig() {
		return this.config;
	}
}
