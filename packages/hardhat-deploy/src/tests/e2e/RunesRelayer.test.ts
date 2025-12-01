import {
	SystemContracts,
	addRuneERC20Intention,
	executorAbi,
	finalizeBTCTransaction,
	getCreate2RuneAddress,
	runeIdToBytes32,
	signIntention,
} from "@midl/executor";
import { readContract, waitForTransactionReceipt } from "viem/actions";
import { describe, it } from "vitest";
import { useEnvironment } from "../../../tests/useEnvironment";

const isE2ETest = Boolean(process.env.E2E);

describe.runIf(isE2ETest)("RunesRelayer", async () => {
	useEnvironment(true);

	it("adds rune", async () => {
		const {
			hre: { midl },
		} = globalThis;
		await midl.initialize();

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const config = midl.getConfig()!;
		const walletClient = await midl.getWalletClient();
		const runeId = "21779:1";

		const tx = await addRuneERC20Intention(config, runeId);

		const btcTx = await finalizeBTCTransaction(config, [tx], walletClient, {
			skipEstimateGas: true,
		});

		const signedIntention = await signIntention(
			config,
			walletClient,
			tx,
			[tx],
			{
				txId: btcTx.tx.id,
			},
		);

		console.log(
			`Rune ERC20 create2 address will be: ${getCreate2RuneAddress(runeId)}`,
		);

		const txs = await walletClient.sendBTCTransactions({
			btcTransaction: btcTx.tx.hex,
			serializedTransactions: [signedIntention],
		});

		for (const tx of txs) {
			console.log(`Waiting for tx ${tx} to be mined...`);
			await waitForTransactionReceipt(walletClient, {
				hash: tx,
			});
			console.log(`Transaction ${tx} mined.`);
		}

		const [address] = await readContract(walletClient, {
			abi: executorAbi,
			address: SystemContracts.Executor,
			functionName: "getAssetAddressByRuneId",
			args: [runeIdToBytes32(runeId)],
		});

		console.log("Rune ERC20 Address:", address);
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
