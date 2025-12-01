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

export const useEnvironment = (useDotEnv = false) => {
	const rootDir = path.join(__dirname, "fixtures", "hardhat-project");

	beforeAll(() => {
		process.chdir(rootDir);

		if (useDotEnv) {
			require("dotenv").config({ path: path.join(rootDir, ".env") });
		}
		globalThis.hre = require("hardhat");
	});
};
