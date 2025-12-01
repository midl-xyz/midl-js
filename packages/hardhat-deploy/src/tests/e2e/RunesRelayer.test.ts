import { waitForTransaction } from "@midl/core";
import {
	SystemContracts,
	addRuneERC20,
	executorAbi,
	finalizeBTCTransaction,
	runeIdToBytes32,
	signIntention,
} from "@midl/executor";
import { readContract } from "viem/actions";
import { describe, it } from "vitest";
import { useEnvironment } from "../../../tests/useEnvironment";

const isE2ETest = Boolean(process.env.E2E);

describe.runIf(isE2ETest)("RunesRelayer", async () => {
	useEnvironment();

	it("adds rune", async () => {
		const {
			hre: { midl },
		} = globalThis;
		await midl.initialize();

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const config = midl.getConfig()!;
		const walletClient = await midl.getWalletClient();

		const tx = await addRuneERC20(config, walletClient, "7467:1", {
			publish: true,
		});

		const btcTx = await finalizeBTCTransaction(config, [tx], walletClient, {
			skipEstimateGas: true,
		});

		// const signedIntention = await signIntention(
		// 	config,
		// 	walletClient,
		// 	tx,
		// 	[tx],
		// 	{
		// 		txId: btcTx.tx.id,
		// 	},
		// );

		const res2 = await readContract(await midl.getWalletClient(), {
			abi: executorAbi,
			address: SystemContracts.Executor,
			functionName: "getAssetAddressByRuneId",
			args: [runeIdToBytes32("7467:1")],
		});

		console.log("res before finalization:", res2);

		await walletClient.sendBTCTransactions({
			btcTransaction: btcTx.tx.hex,
			serializedTransactions: [],
		});

		console.log("BTC TX ID:", btcTx.tx.id);

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		await waitForTransaction(midl.getConfig()!, btcTx.tx.id);

		const res = await readContract(await midl.getWalletClient(), {
			abi: executorAbi,
			address: SystemContracts.Executor,
			functionName: "getAssetAddressByRuneId",
			args: [runeIdToBytes32("7467:1")],
		});

		console.log(res);
	});

	// it("deploys RunesRelayer contract", async () => {
	// 	const {
	// 		hre: { midl },
	// 	} = globalThis;

	// 	await midl.initialize();
	// 	await midl.deploy("RunesRelayer", {
	// 		args: ["0x86c2122eFdfe6eA9F7a69c34aDb0D8BCa70bdbea"],
	// 	});
	// 	await midl.execute();
	// });
});
