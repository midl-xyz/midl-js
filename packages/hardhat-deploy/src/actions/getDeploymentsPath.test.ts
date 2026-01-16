import os from "node:os";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { describe, expect, it, vi } from "vitest";
import { getDeploymentsPath } from "~/actions/getDeploymentsPath";

const makeHre = (deploymentsPath?: string) => {
	return {
		userConfig: {
			midl: {
				path: deploymentsPath,
			},
		},
		config: {
			paths: {
				root: "/user/project",
			},
		},
	} as unknown as HardhatRuntimeEnvironment;
};

describe("getDeploymentsPath", () => {
	it("returns the default deployments path when none is configured", () => {
		expect(getDeploymentsPath(makeHre())).toEqual("/user/project/deployments");
	});

	it("returns the absolute deployments path when an absolute path is configured", () => {
		expect(
			getDeploymentsPath(makeHre("/custom/absolute/deployments/path")),
		).toEqual("/custom/absolute/deployments/path");
	});

	it("returns the relative deployments path when a relative path is configured", () => {
		expect(
			getDeploymentsPath(makeHre("custom/relative/deployments/path")),
		).toEqual("/user/project/custom/relative/deployments/path");
	});

	it("normalizes the deployments path", () => {
		expect(
			getDeploymentsPath(makeHre("custom/relative/../deployments/path/")),
		).toEqual("/user/project/custom/deployments/path");
	});

	it("handles ~ in the deployments path", () => {
		const spy = vi.spyOn(os, "homedir").mockReturnValue("/user/home");

		expect(getDeploymentsPath(makeHre("~/custom/deployments/path"))).toEqual(
			"/user/home/custom/deployments/path",
		);

		spy.mockRestore();
	});
});
