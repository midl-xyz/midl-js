import {
	SystemContracts,
	addRuneERC20,
	executorAbi,
	runeIdToBytes32,
} from "@midl/executor";
import { readContract } from "viem/actions";
import { describe, it } from "vitest";
import { useEnvironment } from "../../../tests/useEnvironment";

const isE2ETest = Boolean(process.env.E2E);

describe.runIf(isE2ETest)("RunesRelayer", async () => {
	useEnvironment();

	it("deploys RunesRelayer contract", async () => {
		const {
			hre: { midl },
		} = globalThis;

		await midl.initialize();
		await midl.deploy("RunesRelayer", {
			args: ["0x86c2122eFdfe6eA9F7a69c34aDb0D8BCa70bdbea"],
		});
		await midl.execute();
	});

	it("deposits Rune ERC20 tokens via RunesRelayer", async () => {
		const {
			hre: { midl },
		} = globalThis;

		await midl.initialize();

		try {
			// const data = await addRuneERC20(
			// 	// biome-ignore lint/style/noNonNullAssertion: <explanation>
			// 	hre.midl.getConfig()!,
			// 	await midl.getWalletClient(),
			// 	"7467:1",
			// 	{ publish: true },
			// );

			// console.log("Deposit transaction hash:", data.tx.id);

			const [address] = await readContract(await midl.getWalletClient(), {
				abi: executorAbi,
				address: SystemContracts.Executor,
				functionName: "getAssetAddressByRuneId",
				args: [runeIdToBytes32("7467:1")],
			});

			console.log("Rune ERC20 address:", address);
		} catch (e) {
			console.error("Error depositing Rune ERC20:", e);
		}
	});
});
