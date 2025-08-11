import fs from "node:fs";
import path from "node:path";
import {
	AddressPurpose,
	AddressType,
	type BitcoinNetwork,
	type Config,
	SignMessageProtocol,
	connect,
	createConfig,
	getDefaultAccount,
	mainnet,
	regtest,
	signet,
	testnet,
	testnet4,
	waitForTransaction,
} from "@midl-xyz/midl-js-core";
import type { Chain, TransactionIntention } from "@midl-xyz/midl-js-executor";
import {
	addCompleteTxIntention,
	addTxIntention,
	finalizeBTCTransaction,
	getEVMAddress,
	getEVMFromBitcoinNetwork,
	signIntention,
} from "@midl-xyz/midl-js-executor";
import { keyPairConnector } from "@midl-xyz/midl-js-node";
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
	type Abi,
	type Address,
	type StateOverride,
	type TransactionSerializableBTC,
	type Chain as ViemChain,
	type WalletClient,
	createWalletClient,
	encodeDeployData,
	encodeFunctionData,
	getContractAddress,
	keccak256,
} from "viem";
import { sendBTCTransactions, waitForTransactionReceipt } from "viem/actions";
import { type StoreApi, createStore } from "zustand";
import "~/types/context";

export class MidlHardhatEnvironment {
	private readonly store: StoreApi<{
		intentions: TransactionIntention[];
	}> = createStore<{
		intentions: TransactionIntention[];
	}>()(() => ({
		intentions: [],
	}));

	private readonly deploymentsPath: string;
	private readonly confirmationsRequired;
	private readonly btcConfirmationsRequired;

	private walletClient: WalletClient | undefined;

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
	}

	private initializeNetwork() {
		const networks = { regtest, mainnet, testnet4, testnet, signet } as const;
		const { network, hardhatNetwork } = this.userConfig;

		if (typeof network === "string") {
			if (!(network in networks)) {
				throw new Error(`Network ${network} is not supported`);
			}

			this.bitcoinNetwork = networks[network as keyof typeof networks];
		} else {
			this.bitcoinNetwork = network || regtest;
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
		this.config = createConfig({
			networks: [this.bitcoinNetwork],
			connectors: [
				keyPairConnector({
					mnemonic: this.userConfig.mnemonic,
					paymentAddressType: AddressType.P2WPKH,
					accountIndex,
				}),
			],
			defaultPurpose: this.userConfig.defaultPurpose,
			provider: this.userConfig.provider,
		});

		await connect(this.config, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});

		this.store.setState({
			intentions: [],
		});
	}

	public async deploy(
		name: string,
		options?: Pick<
			TransactionSerializableBTC,
			"to" | "value" | "gas" | "nonce"
			// biome-ignore lint/suspicious/noExplicitAny: Allow any args
		> & { args?: any; libraries?: Libraries<Address> },
		intentionOptions: Pick<TransactionIntention, "deposit" | "withdraw"> = {},
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

		const intention = await addTxIntention(this.config, {
			evmTransaction: {
				type: "btc",
				chainId: this.walletClient?.chain?.id,
				data: deployData,
				gas: options?.gas,
				to: options?.to,
				value: options?.value,
				nonce: options?.nonce,
			},
			meta: {
				contractName: name,
			},
			...intentionOptions,
		});

		this.store.setState((state) => ({
			intentions: [...state.intentions, intention],
		}));
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
			"to" | "value" | "gas" | "nonce"
			// biome-ignore lint/suspicious/noExplicitAny: Allow any args
		> & { args: any },
		intentionOptions: Pick<TransactionIntention, "deposit" | "withdraw"> = {},
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

		const intention = await addTxIntention(this.config, {
			evmTransaction: {
				type: "btc",
				chainId: this.walletClient?.chain?.id,
				data,
				to: options.to ?? (address as Address),
				value: options.value,
				nonce: options.nonce,
				gas: options.gas,
			},
			...intentionOptions,
		});

		this.store.setState((state) => ({
			intentions: [...state.intentions, intention],
		}));
	}

	public async execute({
		stateOverride,
		feeRate,
		skipEstimateGas = false,
		withdraw,
	}: {
		stateOverride?: StateOverride;
		feeRate?: number;
		skipEstimateGas?: boolean;
	} & Pick<TransactionIntention, "deposit" | "withdraw"> = {}) {
		if (!this.config) {
			throw new Error("MidlHardhatEnvironment not initialized");
		}

		let intentions = this.store.getState().intentions;

		if (!intentions || intentions.length === 0) {
			console.warn("No intentions to execute");

			return;
		}

		const walletClient = await this.getWalletClient();

		if (typeof withdraw !== "undefined") {
			const intention = await addCompleteTxIntention(this.config, withdraw);

			this.store.setState((state) => ({
				intentions: [...state.intentions, intention],
			}));
		}

		const tx = await finalizeBTCTransaction(
			this.config,
			this.store.getState().intentions ?? [],
			walletClient,
			{
				stateOverride,
				feeRate,
				skipEstimateGas,
			},
		);

		const evmTXHashes: `0x${string}`[] = [];

		// biome-ignore lint/style/noNonNullAssertion: reload intentions in case of shouldComplete equal true
		intentions = this.store.getState().intentions!;

		const txs: `0x${string}`[] = [];

		for (const intention of intentions) {
			const signed = await signIntention(
				this.config,
				walletClient,
				intention,
				this.store.getState().intentions ?? [],
				{
					txId: tx.tx.id,
					protocol: SignMessageProtocol.Bip322,
				},
			);

			const txId = keccak256(signed);

			txs.push(signed);

			if (intention.meta?.contractName) {
				const contractAddress = getContractAddress({
					from: this.getEVMAddress(),
					nonce: BigInt(intention.evmTransaction?.nonce ?? 0),
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

		await sendBTCTransactions(walletClient, {
			serializedTransactions: txs,
			btcTransaction: tx.tx.hex,
		});

		console.log("BTC transaction sent", tx.tx.id);

		await waitForTransaction(
			this.config,
			tx.tx.id,
			this.btcConfirmationsRequired,
		);

		await Promise.all(
			evmTXHashes.map((hash) =>
				waitForTransactionReceipt(walletClient, {
					hash,
					confirmations: this.confirmationsRequired,
				}),
			),
		);

		console.log("Transaction confirmed", tx.tx.id);

		this.store.setState((state) => ({
			...state,
			intentions: [],
		}));
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
			abi: Abi;
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

	public async deleteDeployment(name: string) {
		const filePath = path.join(this.deploymentsPath, `${name}.json`);

		if (!fs.existsSync(filePath)) {
			throw new Error(`No deployment file found for "${name}" at ${filePath}`);
		}

		fs.unlinkSync(filePath);
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

	public getEVMAddress() {
		if (!this.config) {
			throw new Error("MidlHardhatEnvironment not initialized");
		}

		return getEVMAddress(this.getAccount(), this.bitcoinNetwork);
	}

	public getAccount() {
		if (!this.config) {
			throw new Error("MidlHardhatEnvironment not initialized");
		}

		return getDefaultAccount(this.config);
	}
}
