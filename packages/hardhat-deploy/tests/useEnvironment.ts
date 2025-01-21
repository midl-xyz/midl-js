import { beforeEach } from "vitest";
import path from "node:path";
import { afterEach } from "node:test";
import { resetHardhatContext } from "hardhat/plugins-testing";
import type { HardhatRuntimeEnvironment } from "hardhat/types";

declare global {
	var hre: HardhatRuntimeEnvironment;

	namespace NodeJS {
		interface Global {
			hre: HardhatRuntimeEnvironment;
		}
	}
}

export const useEnvironment = () => {
	beforeEach(() => {
		process.chdir(path.join(__dirname, "fixtures", "hardhat-project"));

		globalThis.hre = require("hardhat");
	});

	afterEach(() => {
		resetHardhatContext();
	});
};
