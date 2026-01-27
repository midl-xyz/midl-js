import { type Config, getDefaultAccount } from "@midl/core";
import {
	type PartialIntention,
	addRuneERC20Intention,
	getEVMAddress,
} from "@midl/executor";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { http, type PublicClient, createPublicClient } from "viem";
import {
	type DeployContractIntentionOverrides,
	type DeployContractOptions,
	type DeploymentData,
	type ExecuteOptions,
	type ReadContractOptions,
	type WriteContractEvmTransactionOverrides,
	type WriteContractOptions,
	addTxIntentionToStore,
	createStore,
	deleteDeployment,
	deployContract,
	execute,
	getBitcoinNetwork,
	getChain,
	getDeployment,
	readContract,
	saveDeployment,
	setup,
	writeContract,
} from "~/actions";
import type { MidlNetworkConfig } from "~/type-extensions";

export const createMidlHardhatEnvironment = (
	hre: HardhatRuntimeEnvironment,
) => {
	const store = createStore();

	const userConfig: MidlNetworkConfig =
		hre.userConfig.midl.networks[hre.hardhatArguments.network ?? "default"];

	const chain = getChain(userConfig, hre);
	const bitcoinNetwork = getBitcoinNetwork(userConfig);
	const publicClient = createPublicClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});

	let config: Config | null = null;

	return {
		initialize: async (accountIndex = 0) => {
			config = await setup(userConfig, store, {
				bitcoinNetwork,
				accountIndex,
			});

			return config;
		},
		deploy: async (
			name: string,
			args?: unknown[],
			options: DeployContractOptions = {},
			overrides: DeployContractIntentionOverrides = {},
		) => {
			if (!config) {
				throw new Error("Midl not initialized. Call initialize() first.");
			}

			return deployContract(
				hre,
				config,
				store,
				publicClient,
				name,
				args,
				options,
				overrides,
			);
		},
		execute: async (options?: ExecuteOptions) => {
			if (!config) {
				throw new Error("Midl not initialized. Call initialize() first.");
			}

			return await execute(
				userConfig,
				hre,
				config,
				store,
				publicClient,
				options,
			);
		},
		read: async (
			name: string,
			functionName: string,
			args?: unknown[],
			options?: ReadContractOptions,
		) => {
			if (!config) {
				throw new Error("Midl not initialized. Call initialize() first.");
			}

			return readContract(hre, publicClient, name, functionName, args, options);
		},
		write: async (
			name: string,
			functionName: string,
			args?: unknown[],
			evmTransactionOverrides: WriteContractEvmTransactionOverrides = {},
			options: WriteContractOptions = {},
		) => {
			if (!config) {
				throw new Error("Midl not initialized. Call initialize() first.");
			}
			return writeContract(
				hre,
				config,
				store,
				publicClient,
				name,
				functionName,
				args,
				evmTransactionOverrides,
				options,
			);
		},
		save(name: string, data: DeploymentData) {
			return saveDeployment(hre, name, data);
		},
		delete(name: string) {
			return deleteDeployment(hre, name);
		},
		get(name: string) {
			return getDeployment(hre, name);
		},
		addTxIntention: async (data: PartialIntention) => {
			if (!config) {
				throw new Error("Midl not initialized. Call initialize() first.");
			}

			return addTxIntentionToStore(config, store, publicClient, data);
		},
		addRuneERC20Intention: async (runeId: string) => {
			if (!config) {
				throw new Error("Midl not initialized. Call initialize() first.");
			}

			const intention = await addRuneERC20Intention(config, runeId);

			return addTxIntentionToStore(config, store, publicClient, intention);
		},
		get account() {
			if (!config) {
				throw new Error("Midl not initialized. Call initialize() first.");
			}

			return getDefaultAccount(config);
		},
		get config() {
			if (!config) {
				throw new Error("Midl not initialized. Call initialize() first.");
			}

			return config;
		},
		get publicClient() {
			return publicClient as PublicClient;
		},
		evm: {
			get address() {
				if (!config) {
					throw new Error("Midl not initialized. Call initialize() first.");
				}

				return getEVMAddress(
					getDefaultAccount(config),
					config.getState().network,
				);
			},
		},
	};
};
