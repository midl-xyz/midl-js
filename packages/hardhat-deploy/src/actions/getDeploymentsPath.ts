import os from "node:os";
import path from "node:path";
import type { HardhatRuntimeEnvironment } from "hardhat/types";

export const getDeploymentsPath = (hre: HardhatRuntimeEnvironment): string => {
	const configPath = hre.userConfig.midl?.path ?? "deployments";

	const expandedPath = configPath.startsWith("~")
		? path.join(os.homedir(), configPath.slice(1))
		: configPath;

	const resolvedPath = path.isAbsolute(expandedPath)
		? expandedPath
		: path.join(hre.config.paths.root, expandedPath);

	return path.resolve(resolvedPath);
};
