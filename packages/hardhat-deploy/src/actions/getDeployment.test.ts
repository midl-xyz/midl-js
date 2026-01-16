import fs from "node:fs/promises";
import path from "node:path";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDeploymentsPath } from "~/actions/getDeploymentsPath";
import type { DeploymentData } from "~/actions/saveDeployment";
import { getDeployment } from "./getDeployment";

vi.mock("node:fs/promises");
vi.mock("~/actions/getDeploymentsPath");

describe("getDeployment", () => {
	const mockHre = {} as HardhatRuntimeEnvironment;
	const mockDeploymentsPath = "/mock/deployments/path";

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getDeploymentsPath).mockReturnValue(mockDeploymentsPath);
	});

	it("reads and parses deployment file from correct path", async () => {
		const deploymentData: DeploymentData = {
			address: "0x1234567890abcdef",
			abi: [{ type: "function", name: "test" }],
			txId: "0xabc123",
		};
		vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(deploymentData));

		const result = await getDeployment(mockHre, "MyContract");

		const expectedPath = path.join(mockDeploymentsPath, "MyContract.json");
		expect(fs.readFile).toHaveBeenCalledWith(expectedPath, "utf-8");
		expect(result).toEqual(deploymentData);
	});

	it("uses getDeploymentsPath to determine deployment location", async () => {
		const deploymentData: DeploymentData = {
			address: "0x1234567890abcdef",
		};
		vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(deploymentData));

		await getDeployment(mockHre, "TestContract");

		expect(getDeploymentsPath).toHaveBeenCalledWith(mockHre);
	});

	it("returns null when deployment file does not exist (ENOENT)", async () => {
		const enoentError = Object.assign(new Error("File not found"), {
			code: "ENOENT",
		});
		vi.mocked(fs.readFile).mockRejectedValue(enoentError);

		const result = await getDeployment(mockHre, "NonExistentContract");

		expect(result).toBeNull();
	});

	it("throws error when reading fails for reasons other than ENOENT", async () => {
		const permissionError = Object.assign(new Error("Permission denied"), {
			code: "EACCES",
		});
		vi.mocked(fs.readFile).mockRejectedValue(permissionError);

		await expect(getDeployment(mockHre, "ProtectedContract")).rejects.toThrow(
			"Permission denied",
		);
	});

	it("throws error when JSON parsing fails", async () => {
		vi.mocked(fs.readFile).mockResolvedValue("invalid json {");

		await expect(getDeployment(mockHre, "InvalidContract")).rejects.toThrow();
	});

	it("parses deployment data without optional fields", async () => {
		const deploymentData: DeploymentData = {
			address: "0xfedcba0987654321",
		};
		vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(deploymentData));

		const result = await getDeployment(mockHre, "MinimalContract");

		expect(result).toEqual(deploymentData);
		expect(result?.address).toBe("0xfedcba0987654321");
		expect(result?.txId).toBeUndefined();
		expect(result?.abi).toBeUndefined();
	});

	it("parses deployment data with all fields", async () => {
		const deploymentData: DeploymentData = {
			address: "0x1111111111111111",
			txId: "0xdef456",
			abi: [
				{ type: "constructor", inputs: [] },
				{ type: "function", name: "transfer", inputs: [], outputs: [] },
				{ type: "event", name: "Transfer", inputs: [] },
			],
		};
		vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(deploymentData));

		const result = await getDeployment(mockHre, "FullContract");

		expect(result).toEqual(deploymentData);
		expect(result?.address).toBe("0x1111111111111111");
		expect(result?.txId).toBe("0xdef456");
		expect(result?.abi).toHaveLength(3);
	});

	it("handles contract names with special characters", async () => {
		const deploymentData: DeploymentData = {
			address: "0x2222222222222222",
		};
		vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(deploymentData));

		await getDeployment(mockHre, "My-Contract_v2");

		const expectedPath = path.join(mockDeploymentsPath, "My-Contract_v2.json");
		expect(fs.readFile).toHaveBeenCalledWith(expectedPath, "utf-8");
	});

	it("reads file with utf-8 encoding", async () => {
		const deploymentData: DeploymentData = {
			address: "0x3333333333333333",
		};
		vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(deploymentData));

		await getDeployment(mockHre, "EncodedContract");

		const expectedPath = path.join(mockDeploymentsPath, "EncodedContract.json");
		expect(fs.readFile).toHaveBeenCalledWith(expectedPath, "utf-8");
	});

	it("handles empty ABI array", async () => {
		const deploymentData: DeploymentData = {
			address: "0x4444444444444444",
			abi: [],
		};
		vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(deploymentData));

		const result = await getDeployment(mockHre, "EmptyAbiContract");

		expect(result?.abi).toEqual([]);
	});

	it("throws error on generic file system errors", async () => {
		const genericError = new Error("Disk I/O error");
		vi.mocked(fs.readFile).mockRejectedValue(genericError);

		await expect(getDeployment(mockHre, "FailingContract")).rejects.toThrow(
			"Disk I/O error",
		);
	});
});
