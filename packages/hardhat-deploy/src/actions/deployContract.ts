import type { Config } from "@midl/core";
import type { PartialIntention } from "@midl/executor";
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
import { addTxIntentionToStore } from "~/actions/addTxIntentionToStore";
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

	const intention = await addTxIntentionToStore(config, store, publicClient, {
		...overrides,
		evmTransaction: {
			...options,
			data: deployData,
		},
		meta: {
			contractName: name,
		},
	});

	if (
		!intention.evmTransaction?.from ||
		intention.evmTransaction.nonce === undefined
	) {
		throw new Error("Intention is missing from address or nonce");
	}

	return {
		address: getContractAddress({
			from: intention.evmTransaction.from,
			nonce: BigInt(intention.evmTransaction.nonce),
		}),
		abi: artifact.abi,
	};
};
