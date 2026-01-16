import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type { PublicClient, ReadContractParameters } from "viem";
import { getDeployment } from "~/actions/getDeployment";

export type ReadContractOptions = {
	overrides?: Omit<
		ReadContractParameters,
		"address" | "functionName" | "abi" | "args"
	>;
};

export const readContract = async (
	hre: HardhatRuntimeEnvironment,
	publicClient: PublicClient,
	name: string,
	functionName: string,
	args: unknown[] = [],
	options: ReadContractOptions = {},
) => {
	const deployment = await getDeployment(hre, name);

	if (!deployment) {
		throw new Error(`Contract ${name} is not deployed`);
	}

	const artifact = await hre.artifacts.readArtifact(name);

	return publicClient.readContract({
		address: deployment.address,
		functionName,
		abi: artifact.abi,
		args: args,
		...options.overrides,
	});
};
