import { defineConfig } from "@wagmi/cli";
import Executor from "@midl-xyz/contracts/deployments/0.0.9/Executor.json" with {
	type: "json",
};
import ExecutorL2 from "@midl-xyz/contracts/deployments/0.0.9/ExecutorL2.json" with {
	type: "json",
};
import type { Abi } from "viem";

export default defineConfig({
	out: "src/contracts/abi.ts",
	contracts: [
		{
			name: Executor.contractName,
			abi: Executor.abi as Abi,
		},
		{
			name: ExecutorL2.contractName,
			abi: ExecutorL2.abi as Abi,
		},
	],
});
