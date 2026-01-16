import { type Config, getDefaultAccount } from "@midl/core";
import {
	type PartialIntention,
	addTxIntention,
	getEVMAddress,
} from "@midl/executor";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { type PublicClient, encodeFunctionData } from "viem";
import type { StoreApi } from "zustand";
import type { MidlHardhatStore } from "~/actions/createStore";
import { getDeployment } from "~/actions/getDeployment";

export type WriteContractOptions = {
	overrides?: Omit<PartialIntention, "meta" | "evmTransaction" | "withdraw"> & {
		evmTransaction?: Omit<
			NonNullable<PartialIntention["evmTransaction"]>,
			"data"
		>;
	};
};

export const writeContract = async (
	hre: HardhatRuntimeEnvironment,
	config: Config,
	store: StoreApi<MidlHardhatStore>,
	publicClient: PublicClient,
	name: string,
	functionName: string,
	args: unknown[] = [],
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
			to: deployment.address,
			data: callData,
			nonce,
			...options.overrides?.evmTransaction,
		},
	});

	store.setState((state) => ({
		intentions: [...state.intentions, intention],
	}));

	return intention;
};
