import fs from "node:fs";
import path from "node:path";
import {
	AddressPurpose,
	type BitcoinNetwork,
	type Config,
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
import type { Chain, TransactionIntention } from "@midl-xyz/midl-js-executor";
import {
	addCompleteTxIntention,
	addTxIntention,
	clearTxIntentions,
	finalizeBTCTransaction,
	getEVMAddress,
	getEVMFromBitcoinNetwork,
	getPublicKeyForAccount,
	signIntention,
} from "@midl-xyz/midl-js-executor";
import { keyPairConnector } from "@midl-xyz/midl-js-node";
import type { MidlContextState } from "@midl-xyz/midl-js-react";
import {
	type Libraries,
	resolveBytecodeWithLinkedLibraries,
} from "@nomicfoundation/hardhat-viem/internal/bytecode";
import type {
	HardhatRuntimeEnvironment,
	HttpNetworkConfig,
} from "hardhat/types";
import {
	http,
	type Address,
	type StateOverride,
	type TransactionSerializableBTC,
	type Chain as ViemChain,
	type WalletClient,
	createWalletClient,
	encodeDeployData,
	encodeFunctionData,
	getContractAddress,
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
	private bitcoinNetwork!: BitcoinNetwork;
	private chain!: Chain;

	private config: Config | null = null;
	private readonly userConfig: HardhatRuntimeEnvironment["userConfig"]["midl"]["networks"][string];

	constructor(private readonly hre: HardhatRuntimeEnvironment) {
		this.userConfig =
			this.hre.userConfig.midl.networks[
				hre.hardhatArguments.network ?? "default"
			];
		this.initializeNetwork();

		this.deploymentsPath = path.join(
			this.hre.config.paths.root,
			this.hre.userConfig.midl.path ?? "deployments",
		);
		this.confirmationsRequired = this.userConfig.confirmationsRequired ?? 5;
		this.btcConfirmationsRequired =
			this.userConfig.btcConfirmationsRequired ?? 1;

		if (!fs.existsSync(this.deploymentsPath)) {
			fs.mkdirSync(this.deploymentsPath);
		}

		this.wallet = new Wallet(this.userConfig.mnemonic, this.bitcoinNetwork);
	}

	private initializeNetwork() {
		const networks = { regtest, mainnet, testnet4, testnet } as const;
		const { network, hardhatNetwork } = this.userConfig;

		if (!network) {
			this.bitcoinNetwork = regtest;
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

		this.chain = getEVMFromBitcoinNetwork(this.bitcoinNetwork);

		if (hardhatNetwork) {
			const { chainId, url } = this.hre.config.networks[
				hardhatNetwork
			] as HttpNetworkConfig;

			if (!chainId) {
				throw new Error(
					`Hardhat network ${hardhatNetwork} does not have chainId defined`,
				);
			}

			if (!url) {
				throw new Error(
					`Hardhat network ${hardhatNetwork} does not have url defined`,
				);
			}

			this.chain = {
				id: chainId,
				name: "MIDL",
				nativeCurrency: {
					name: "MIDL",
					symbol: "MIDL",
					decimals: 18,
				},
				rpcUrls: {
					default: {
						http: [url],
					},
				},
			};
		}
	}

	public async initialize(accountIndex = 0) {
		this.accountIndex = accountIndex;
		this.config = createConfig({
			networks: [this.bitcoinNetwork],
			connectors: [
				keyPairConnector({
					keyPair: this.wallet.getAccount(this.accountIndex),
				}),
			],
			provider: this.userConfig.provider,
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
				chainId: this.walletClient?.chain?.id,
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
			txId: `0x${string}`;
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
				chainId: this.walletClient?.chain?.id,
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
		shouldComplete = false,
		assetsToWithdraw,
	}: {
		stateOverride?: StateOverride;
		feeRateMultiplier?: number;
		skipEstimateGasMulti?: boolean;
	} & (
		| {
				shouldComplete?: false;
				assetsToWithdraw?: never;
		  }
		| {
				shouldComplete: true;
				assetsToWithdraw?: [Address] | [Address, Address];
		  }
	) = {}) {
		if (!this.config) {
			throw new Error("MidlHardhatEnvironment not initialized");
		}

		let intentions = this.store.getState().intentions;

		if (!intentions || intentions.length === 0) {
			console.warn("No intentions to execute");

			return;
		}

		const walletClient = await this.getWalletClient();
		const publicKey = await getPublicKeyForAccount(this.config);

		if (shouldComplete) {
			await addCompleteTxIntention(this.config, this.store, assetsToWithdraw);
		}

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
				assetsToWithdrawSize: assetsToWithdraw?.length ?? 0,
			},
		);

		const evmTXHashes: `0x${string}`[] = [];

		// biome-ignore lint/style/noNonNullAssertion: reload intentions in case of shouldComplete equal true
		intentions = this.store.getState().intentions!;

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

			evmTXHashes.push(txId);

			console.log("Transaction sent", txId);
		}

		const txId = await broadcastTransaction(this.config, tx.tx.hex);
		await waitForTransaction(this.config, txId, this.btcConfirmationsRequired);
		await Promise.all(
			evmTXHashes.map((hash) =>
				waitForTransactionReceipt(walletClient, {
					hash,
					confirmations: this.confirmationsRequired,
				}),
			),
		);

		console.log("Transaction confirmed", txId);

		clearTxIntentions(this.store);
	}

	public async getWalletClient(): Promise<WalletClient> {
		if (!this.walletClient) {
			this.walletClient = createWalletClient({
				chain: this.chain as ViemChain,
				transport: http(this.chain.rpcUrls.default.http[0]),
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

	public getConfig() {
		return this.config;
	}
}
