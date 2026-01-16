import fs from "node:fs/promises";
import path from "node:path";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { getDeploymentsPath } from "~/actions/getDeploymentsPath";
import type { DeploymentData } from "~/actions/saveDeployment";

export const getDeployment = async (
	hre: HardhatRuntimeEnvironment,
	name: string,
): Promise<DeploymentData | null> => {
	const deploymentsPath = getDeploymentsPath(hre);
	const filePath = path.join(deploymentsPath, `${name}.json`);

	try {
		const data = await fs.readFile(filePath, "utf-8");
		return JSON.parse(data);
	} catch (error: unknown) {
		if (
			error instanceof Error &&
			(error as NodeJS.ErrnoException).code === "ENOENT"
		) {
			// File does not exist
			return null;
		}

		throw error;
	}
};
