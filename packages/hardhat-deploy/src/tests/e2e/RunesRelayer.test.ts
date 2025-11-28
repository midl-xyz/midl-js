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
});
