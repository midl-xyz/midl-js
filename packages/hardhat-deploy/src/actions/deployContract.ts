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
} & Omit<NonNullable<PartialIntention["evmTransaction"]>, "data">;

export type DeployContractIntentionOverrides = Omit<
	PartialIntention,
	"meta" | "evmTransaction" | "withdraw"
>;

export const deployContract = async (
	hre: HardhatRuntimeEnvironment,
	config: Config,
	store: StoreApi<MidlHardhatStore>,
	publicClient: PublicClient,
	name: string,
	args: unknown[] = [],
	{ libraries, ...options }: DeployContractOptions = {},
	overrides: DeployContractIntentionOverrides = {},
) => {
	const deployment = await getDeployment(hre, name);

	if (deployment) {
		return deployment;
	}

	const artifact = await hre.artifacts.readArtifact(name);
	const bytecode = await resolveBytecodeWithLinkedLibraries(
		artifact,
		libraries ?? {},
	);

	const deployData = encodeDeployData({
		abi: artifact.abi,
		args,
		bytecode: bytecode as `0x${string}`,
	});

	const evmAddress =
		options.from ??
		getEVMAddress(getDefaultAccount(config), config.getState().network);

	const currentNonce = await publicClient.getTransactionCount({
		address: evmAddress,
	});

	const totalIntentions = store.getState().intentions.length;

	const nonce = options?.nonce ?? currentNonce + totalIntentions;

	const intention = await addTxIntention(config, {
		...overrides,
		evmTransaction: {
			...options,
			data: deployData,
			nonce,
			from: evmAddress,
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
