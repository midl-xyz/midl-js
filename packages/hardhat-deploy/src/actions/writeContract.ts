import type { Config } from "@midl/core";
import type { PartialIntention } from "@midl/executor";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { type PublicClient, encodeFunctionData } from "viem";
import type { StoreApi } from "zustand/vanilla";
import { addTxIntentionToStore } from "~/actions/addTxIntentionToStore";
import type { MidlHardhatStore } from "~/actions/createStore";
import { getDeployment } from "~/actions/getDeployment";

export type WriteContractEvmTransactionOverrides = Omit<
	NonNullable<PartialIntention["evmTransaction"]>,
	"data"
>;

export type WriteContractIntentionOverrides = Omit<
	PartialIntention,
	"meta" | "evmTransaction" | "withdraw"
>;

export type WriteContractOptions = WriteContractIntentionOverrides;

export const writeContract = async (
	hre: HardhatRuntimeEnvironment,
	config: Config,
	store: StoreApi<MidlHardhatStore>,
	publicClient: PublicClient,
	name: string,
	functionName: string,
	args: unknown[] = [],
	evmTransactionOverrides: WriteContractEvmTransactionOverrides = {},
	options: WriteContractOptions = {},
) => {
	const deployment = await getDeployment(hre, name);

	if (!deployment) {
		throw new Error(`Contract ${name} is not deployed`);
	}

	const artifact = await hre.artifacts.readArtifact(name);
	const callData = encodeFunctionData({
		abi: artifact.abi,
		functionName,
		args,
	});

	return addTxIntentionToStore(config, store, publicClient, {
		...options,
		evmTransaction: {
			to: deployment.address,
			data: callData,
			...evmTransactionOverrides,
		},
	});
};
