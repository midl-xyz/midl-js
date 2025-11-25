import path from "node:path";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { beforeAll } from "vitest";

declare global {
	var hre: HardhatRuntimeEnvironment;

	namespace NodeJS {
		interface Global {
			hre: HardhatRuntimeEnvironment;
		}
	}
}

export const useEnvironment = () => {
	const rootDir = path.join(__dirname, "fixtures", "hardhat-project");

	beforeAll(() => {
		process.chdir(rootDir);

		globalThis.hre = require("hardhat");
	});
};
