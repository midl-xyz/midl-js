import fs from "node:fs/promises";
import path from "node:path";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDeploymentsPath } from "~/actions/getDeploymentsPath";
import { deleteDeployment } from "./deleteDeployment";

vi.mock("node:fs/promises");
vi.mock("~/actions/getDeploymentsPath");

describe("deleteDeployment", () => {
	const mockHre = {} as HardhatRuntimeEnvironment;
	const mockDeploymentsPath = "/mock/deployments/path";

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getDeploymentsPath).mockReturnValue(mockDeploymentsPath);
	});

	it("deletes the deployment file with the correct path", async () => {
		vi.mocked(fs.unlink).mockResolvedValue(undefined);

		await deleteDeployment(mockHre, "MyContract");

		const expectedPath = path.join(mockDeploymentsPath, "MyContract.json");
		expect(fs.unlink).toHaveBeenCalledWith(expectedPath);
	});

	it("uses getDeploymentsPath to determine deployment location", async () => {
		vi.mocked(fs.unlink).mockResolvedValue(undefined);

		await deleteDeployment(mockHre, "TestContract");

		expect(getDeploymentsPath).toHaveBeenCalledWith(mockHre);
	});

	it("does not throw when file does not exist (ENOENT)", async () => {
		const enoentError = Object.assign(new Error("File not found"), {
			code: "ENOENT",
		});
		vi.mocked(fs.unlink).mockRejectedValue(enoentError);

		await expect(
			deleteDeployment(mockHre, "NonExistentContract"),
		).resolves.toBeUndefined();

		const expectedPath = path.join(
			mockDeploymentsPath,
			"NonExistentContract.json",
		);
		expect(fs.unlink).toHaveBeenCalledWith(expectedPath);
	});

	it("throws error when deletion fails for reasons other than ENOENT", async () => {
		const permissionError = Object.assign(new Error("Permission denied"), {
			code: "EACCES",
		});
		vi.mocked(fs.unlink).mockRejectedValue(permissionError);

		await expect(
			deleteDeployment(mockHre, "ProtectedContract"),
		).rejects.toThrow("Permission denied");
	});

	it("throws error when deletion fails with generic error", async () => {
		const genericError = new Error("Unknown error");
		vi.mocked(fs.unlink).mockRejectedValue(genericError);

		await expect(deleteDeployment(mockHre, "FailingContract")).rejects.toThrow(
			"Unknown error",
		);
	});

	it("handles contract names with special characters", async () => {
		vi.mocked(fs.unlink).mockResolvedValue(undefined);

		await deleteDeployment(mockHre, "My-Contract_v2");

		const expectedPath = path.join(mockDeploymentsPath, "My-Contract_v2.json");
		expect(fs.unlink).toHaveBeenCalledWith(expectedPath);
	});

	it("constructs correct file path with .json extension", async () => {
		vi.mocked(fs.unlink).mockResolvedValue(undefined);

		await deleteDeployment(mockHre, "TokenContract");

		const expectedPath = path.join(mockDeploymentsPath, "TokenContract.json");
		expect(fs.unlink).toHaveBeenCalledWith(expectedPath);
		expect(expectedPath).toMatch(/\.json$/);
	});
});
