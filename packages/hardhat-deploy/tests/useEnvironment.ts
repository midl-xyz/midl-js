import fs from "node:fs";
import path from "node:path";
import { afterEach } from "node:test";
import { resetHardhatContext } from "hardhat/plugins-testing";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { afterAll, beforeEach } from "vitest";

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

	afterAll(() => {
		fs.rmdirSync(`${rootDir}/deployments`, { recursive: true });
	});

	beforeEach(() => {
		process.chdir(rootDir);

		globalThis.hre = require("hardhat");
	});

	afterEach(() => {
		resetHardhatContext();
	});
};
