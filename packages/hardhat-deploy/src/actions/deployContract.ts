import { type Config, getDefaultAccount } from "@midl/core";
import {
	type PartialIntention,
	addTxIntention,
	getEVMAddress,
} from "@midl/executor";
import {
	type Libraries,
	resolveBytecodeWithLinkedLibraries,
} from "@nomicfoundation/hardhat-viem/internal/bytecode";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import {
	type Address,
	type PublicClient,
	encodeDeployData,
	getContractAddress,
} from "viem";
import type { StoreApi } from "zustand/vanilla";
import type { MidlHardhatStore } from "~/actions/createStore";
import { getDeployment } from "~/actions/getDeployment";

export type DeployContractOptions = {
	libraries?: Libraries<Address>;
	overrides?: Omit<PartialIntention, "meta" | "evmTransaction" | "withdraw"> & {
		evmTransaction?: Omit<
			NonNullable<PartialIntention["evmTransaction"]>,
			"data"
		>;
	};
};

export const deployContract = async (
	hre: HardhatRuntimeEnvironment,
	config: Config,
	store: StoreApi<MidlHardhatStore>,
	publicClient: PublicClient,
	name: string,
	args: unknown[] = [],
	options: DeployContractOptions = {},
) => {
	const deployment = await getDeployment(hre, name);

	if (deployment) {
		return deployment;
	}

	const artifact = await hre.artifacts.readArtifact(name);
	const bytecode = await resolveBytecodeWithLinkedLibraries(
		artifact,
		options?.libraries ?? {},
	);

	const deployData = encodeDeployData({
		abi: artifact.abi,
		args,
		bytecode: bytecode as `0x${string}`,
	});

	const evmAddress =
		options.overrides?.evmTransaction?.from ??
		getEVMAddress(getDefaultAccount(config), config.getState().network);

	const currentNonce = await publicClient.getTransactionCount({
		address: evmAddress,
	});

	const totalIntentions = store.getState().intentions.length;

	const nonce =
		options.overrides?.evmTransaction?.nonce ?? currentNonce + totalIntentions;

	const intention = await addTxIntention(config, {
		...options.overrides,
		evmTransaction: {
			data: deployData,
			nonce,
			from: evmAddress,
			...options.overrides?.evmTransaction,
		},
		meta: {
			contractName: name,
		},
	});

	store.setState((state) => ({
		intentions: [...state.intentions, intention],
	}));

	return {
		address: getContractAddress({
			from: evmAddress,
			nonce: BigInt(nonce),
		}),
		abi: artifact.abi,
	};
};
