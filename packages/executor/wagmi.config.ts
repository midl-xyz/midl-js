import packageJson from "@midl/contracts/package.json" with { type: "json" };
import { defineConfig } from "@wagmi/cli";
import type { Abi } from "viem";

const { default: Executor } = await import(
	`@midl/contracts/deployments/${packageJson.version}/Executor.json`,
	{
		with: { type: "json" },
	}
);

const { default: GlobalParams } = await import(
	`@midl/contracts/deployments/${packageJson.version}/GlobalParams.json`,
	{
		with: { type: "json" },
	}
);

export default defineConfig({
	out: "src/contracts/abi.ts",
	contracts: [
		{
			name: Executor.contractName,
			abi: Executor.abi as Abi,
		},
		{
			name: GlobalParams.contractName,
			abi: GlobalParams.abi as Abi,
		},
	],
});
