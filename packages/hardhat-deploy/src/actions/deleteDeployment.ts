import fs from "node:fs/promises";
import path from "node:path";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { getDeploymentsPath } from "~/actions/getDeploymentsPath";

export const deleteDeployment = async (
	hre: HardhatRuntimeEnvironment,
	name: string,
) => {
	const deploymentsPath = getDeploymentsPath(hre);
	const filePath = path.join(deploymentsPath, `${name}.json`);

	try {
		await fs.unlink(filePath);
	} catch (error: unknown) {
		if (
			error instanceof Error &&
			(error as NodeJS.ErrnoException).code === "ENOENT"
		) {
			// File does not exist, nothing to delete
			return;
		}

		throw error;
	}
};
