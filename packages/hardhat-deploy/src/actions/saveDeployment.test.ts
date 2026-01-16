import fs from "node:fs/promises";
import path from "node:path";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDeploymentsPath } from "~/actions/getDeploymentsPath";
import { type DeploymentData, saveDeployment } from "./saveDeployment";

vi.mock("node:fs/promises");
vi.mock("~/actions/getDeploymentsPath");

describe("saveDeployment", () => {
	const mockReadArtifact = vi.fn();
	const mockHre = {
		artifacts: {
			readArtifact: mockReadArtifact,
		},
	} as unknown as HardhatRuntimeEnvironment;
	const mockDeploymentsPath = "/mock/deployments/path";

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getDeploymentsPath).mockReturnValue(mockDeploymentsPath);
		vi.mocked(fs.mkdir).mockResolvedValue(undefined);
		vi.mocked(fs.writeFile).mockResolvedValue(undefined);
	});

	it("creates the deployments directory recursively", async () => {
		const data: DeploymentData = {
			abi: [],
			address: "0x1234567890abcdef",
		};

		await saveDeployment(mockHre, "MyContract", data);

		expect(fs.mkdir).toHaveBeenCalledWith(mockDeploymentsPath, {
			recursive: true,
		});
	});

	it("writes deployment data to the correct file path", async () => {
		const data: DeploymentData = {
			abi: [{ type: "function", name: "test" }],
			address: "0x1234567890abcdef",
		};

		await saveDeployment(mockHre, "MyContract", data);

		const expectedPath = path.join(mockDeploymentsPath, "MyContract.json");
		expect(fs.writeFile).toHaveBeenCalledWith(
			expectedPath,
			JSON.stringify(
				{
					address: data.address,
					abi: data.abi,
				},
				null,
				2,
			),
		);
	});

	it("saves deployment data with txId", async () => {
		const data: DeploymentData = {
			abi: [],
			address: "0x1234567890abcdef",
			txId: "0xabcdef1234567890",
		};

		await saveDeployment(mockHre, "ContractWithTx", data);

		const expectedPath = path.join(mockDeploymentsPath, "ContractWithTx.json");
		expect(fs.writeFile).toHaveBeenCalledWith(
			expectedPath,
			JSON.stringify(
				{
					address: data.address,
					txId: data.txId,
					abi: data.abi,
				},
				null,
				2,
			),
		);
	});

	it("saves deployment data without txId", async () => {
		const data: DeploymentData = {
			abi: [{ type: "constructor" }],
			address: "0xfedcba0987654321",
		};

		await saveDeployment(mockHre, "ContractNoTx", data);

		const expectedPath = path.join(mockDeploymentsPath, "ContractNoTx.json");
		expect(fs.writeFile).toHaveBeenCalledWith(
			expectedPath,
			JSON.stringify(
				{
					address: data.address,
					abi: data.abi,
				},
				null,
				2,
			),
		);
	});

	it("formats JSON with proper indentation", async () => {
		const data: DeploymentData = {
			abi: [{ type: "function", name: "foo" }],
			address: "0x1234567890abcdef",
			txId: "0xabc",
		};

		await saveDeployment(mockHre, "FormattedContract", data);

		const writeCall = vi.mocked(fs.writeFile).mock.calls[0];
		const jsonString = writeCall[1] as string;

		expect(jsonString).toBe(
			JSON.stringify(
				{
					address: data.address,
					txId: data.txId,
					abi: data.abi,
				},
				null,
				2,
			),
		);
		expect(jsonString).toContain("\n");
	});

	it("uses getDeploymentsPath to determine save location", async () => {
		const data: DeploymentData = {
			abi: [],
			address: "0x1234567890abcdef",
		};

		await saveDeployment(mockHre, "TestContract", data);

		expect(getDeploymentsPath).toHaveBeenCalledWith(mockHre);
	});

	it("handles complex ABI structures", async () => {
		const data: DeploymentData = {
			abi: [
				{ type: "constructor", inputs: [] },
				{ type: "function", name: "transfer", inputs: [], outputs: [] },
				{ type: "event", name: "Transfer", inputs: [] },
			],
			address: "0x1234567890abcdef",
			txId: "0xabc123",
		};

		await saveDeployment(mockHre, "ComplexContract", data);

		const expectedPath = path.join(mockDeploymentsPath, "ComplexContract.json");
		expect(fs.writeFile).toHaveBeenCalledWith(
			expectedPath,
			JSON.stringify(
				{
					address: data.address,
					txId: data.txId,
					abi: data.abi,
				},
				null,
				2,
			),
		);
	});

	it("overwrites existing deployment files without error", async () => {
		const data: DeploymentData = {
			abi: [],
			address: "0x1234567890abcdef",
		};

		// First save
		await saveDeployment(mockHre, "OverwriteContract", data);
		// Second save to overwrite
		await saveDeployment(mockHre, "OverwriteContract", data);

		const expectedPath = path.join(
			mockDeploymentsPath,
			"OverwriteContract.json",
		);
		expect(fs.writeFile).toHaveBeenCalledWith(
			expectedPath,
			JSON.stringify(
				{
					address: data.address,
					abi: data.abi,
				},
				null,
				2,
			),
		);
		expect(fs.writeFile).toHaveBeenCalledTimes(2);
	});

	it("uses provided ABI when present in data", async () => {
		const providedAbi = [
			{ type: "function", name: "customFunction" },
			{ type: "event", name: "CustomEvent" },
		];

		const data: DeploymentData = {
			abi: providedAbi,
			address: "0x1234567890abcdef",
			txId: "0xabc",
		};

		await saveDeployment(mockHre, "ContractWithProvidedAbi", data);

		// Should not call readArtifact when ABI is provided
		expect(mockReadArtifact).not.toHaveBeenCalled();

		// Should save with the provided ABI
		const expectedPath = path.join(
			mockDeploymentsPath,
			"ContractWithProvidedAbi.json",
		);
		expect(fs.writeFile).toHaveBeenCalledWith(
			expectedPath,
			JSON.stringify(
				{
					address: data.address,
					txId: data.txId,
					abi: providedAbi,
				},
				null,
				2,
			),
		);
	});

	it("reads ABI from artifacts when not provided in data", async () => {
		const artifactAbi = [
			{ type: "constructor", inputs: [] },
			{ type: "function", name: "mint", inputs: [], outputs: [] },
		];
		mockReadArtifact.mockResolvedValue({
			abi: artifactAbi,
			bytecode: "0x123456",
		});

		const data: DeploymentData = {
			address: "0xfedcba0987654321",
			txId: "0xdef456",
			// No ABI provided
		};

		await saveDeployment(mockHre, "ContractName", data);

		// Should call readArtifact with the contract name
		expect(mockReadArtifact).toHaveBeenCalledWith("ContractName");
		expect(mockReadArtifact).toHaveBeenCalledTimes(1);

		// Should save with the ABI from artifacts
		const expectedPath = path.join(mockDeploymentsPath, "ContractName.json");
		expect(fs.writeFile).toHaveBeenCalledWith(
			expectedPath,
			JSON.stringify(
				{
					address: data.address,
					txId: data.txId,
					abi: artifactAbi,
				},
				null,
				2,
			),
		);
	});

	it("reads ABI from artifacts when ABI is undefined", async () => {
		const artifactAbi = [{ type: "fallback" }];
		mockReadArtifact.mockResolvedValue({
			abi: artifactAbi,
		});

		const data: DeploymentData = {
			address: "0x1111111111111111",
			abi: undefined,
		};

		await saveDeployment(mockHre, "FallbackContract", data);

		expect(mockReadArtifact).toHaveBeenCalledWith("FallbackContract");

		const writeCall = vi.mocked(fs.writeFile).mock.calls[0];
		const savedData = JSON.parse(writeCall[1] as string);

		expect(savedData.abi).toEqual(artifactAbi);
	});
});
