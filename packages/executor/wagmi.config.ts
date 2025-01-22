import { defineConfig } from "@wagmi/cli";
import Executor from "@midl-xyz/contracts/deployments/0.0.6-alpha/Executor.json" with {
	type: "json",
};
import ExecutorMidl from "@midl-xyz/contracts/deployments/0.0.6-alpha/ExecutorMidl.json" with {
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
			name: ExecutorMidl.contractName,
			abi: ExecutorMidl.abi as Abi,
		},
	],
});
