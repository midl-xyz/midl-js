import {
	type Config,
	SignMessageProtocol,
	getDefaultAccount,
	waitForTransaction,
} from "@midl/core";
import {
	type FinalizeBTCTransactionOptions,
	type Withdrawal,
	addCompleteTxIntention,
	finalizeBTCTransaction,
	getEVMAddress,
	signIntention,
} from "@midl/executor";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { type PublicClient, getContractAddress, keccak256 } from "viem";
import type { StoreApi } from "zustand/vanilla";
import type { MidlHardhatStore } from "~/actions/createStore";
import { saveDeployment } from "~/actions/saveDeployment";
import type { MidlNetworkConfig } from "~/type-extensions";

export type ExecuteOptions = {
	overrides?: FinalizeBTCTransactionOptions;
	withdraw?: Withdrawal | boolean;
};

export const execute = async (
	userConfig: MidlNetworkConfig,
	hre: HardhatRuntimeEnvironment,
	config: Config,
	store: StoreApi<MidlHardhatStore>,
	publicClient: PublicClient,
	options: ExecuteOptions = {
		overrides: {},
		withdraw: false,
	},
) => {
	const intentions = structuredClone(store.getState().intentions);

	if (intentions.length === 0) {
		throw new Error("No intentions to execute");
	}

	if (options.withdraw) {
		const completeTx = await addCompleteTxIntention(
			config,
			options.withdraw === true ? undefined : options.withdraw,
		);

		intentions.push(completeTx);
	}

	const { tx } = await finalizeBTCTransaction(
		config,
		intentions,
		publicClient,
		options.overrides,
	);

	const signedTransactions: `0x07${string}`[] = [];
	const evmTransactionsHashes: `0x${string}`[] = [];

	for (const intention of intentions) {
		const signedTx = await signIntention(
			config,
			publicClient,
			intention,
			intentions,
			{
				txId: tx.id,
				protocol: SignMessageProtocol.Bip322,
			},
		);

		const txId = keccak256(signedTx);

		evmTransactionsHashes.push(txId);
		signedTransactions.push(signedTx);

		const evmAddress =
			intention.evmTransaction?.from ??
			getEVMAddress(getDefaultAccount(config), config.getState().network);

		const currentNonce = await publicClient.getTransactionCount({
			address: evmAddress,
		});

		const nonce =
			intention?.evmTransaction?.nonce ?? currentNonce + intentions.length;

		if (intention.meta?.contractName) {
			const contractAddress = getContractAddress({
				from: evmAddress,
				nonce: BigInt(nonce),
			});

			const artifact = await hre.artifacts.readArtifact(
				intention.meta.contractName,
			);

			await saveDeployment(hre, intention.meta.contractName, {
				txId,
				address: contractAddress,
				abi: artifact.abi,
			});
		}
	}

	await publicClient.sendBTCTransactions({
		btcTransaction: tx.hex,
		serializedTransactions: signedTransactions,
	});

	await waitForTransaction(config, tx.id, userConfig.btcConfirmationsRequired);

	await Promise.all(
		evmTransactionsHashes.map((hash) =>
			publicClient.waitForTransactionReceipt({
				hash,
				confirmations: userConfig.confirmationsRequired,
			}),
		),
	);

	store.setState(() => ({
		intentions: [],
	}));

	return [tx.id, evmTransactionsHashes];
};
