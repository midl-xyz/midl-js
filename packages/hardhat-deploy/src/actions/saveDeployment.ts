import fs from "node:fs/promises";
import path from "node:path";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type { Address } from "viem";
import { getDeploymentsPath } from "~/actions/getDeploymentsPath";

export type DeploymentData = {
	address: Address;
	txId?: string;
	abi?: unknown[];
};

export const saveDeployment = async (
	hre: HardhatRuntimeEnvironment,
	name: string,
	data: DeploymentData,
) => {
	const deploymentsPath = getDeploymentsPath(hre);

	const fileData = structuredClone(data);

	if (!fileData.abi) {
		const artifact = await hre.artifacts.readArtifact(name);
		fileData.abi = artifact.abi;
	}

	await fs.mkdir(deploymentsPath, { recursive: true });
	const filePath = path.join(deploymentsPath, `${name}.json`);
	await fs.writeFile(
		filePath,
		JSON.stringify(
			{
				address: fileData.address,
				txId: fileData.txId,
				abi: fileData.abi,
			},
			null,
			2,
		),
	);
};
