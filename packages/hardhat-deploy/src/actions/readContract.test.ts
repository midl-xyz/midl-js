import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type { Address, PublicClient } from "viem";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDeployment } from "~/actions/getDeployment";
import { readContract } from "./readContract";

vi.mock("~/actions/getDeployment");

describe("readContract", () => {
	const mockReadArtifact = vi.fn();
	const mockHre = {
		artifacts: {
			readArtifact: mockReadArtifact,
		},
	} as unknown as HardhatRuntimeEnvironment;

	const mockReadContractFn = vi.fn();
	const mockPublicClient = {
		readContract: mockReadContractFn,
	} as unknown as PublicClient;

	const mockContractAddress =
		"0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" as Address;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("throws error if contract is not deployed", async () => {
		vi.mocked(getDeployment).mockResolvedValue(null);

		await expect(
			readContract(
				mockHre,
				mockPublicClient,
				"NonExistentContract",
				"balanceOf",
			),
		).rejects.toThrow("Contract NonExistentContract is not deployed");
	});

	it("reads artifact and calls publicClient.readContract", async () => {
		const mockArtifact = {
			abi: [
				{
					type: "function",
					name: "balanceOf",
					inputs: [{ type: "address" }],
					outputs: [{ type: "uint256" }],
				},
			],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		mockReadContractFn.mockResolvedValue(1000n);

		const args = ["0x1111111111111111111111111111111111111111"];

		await readContract(mockHre, mockPublicClient, "Token", "balanceOf", args);

		expect(mockReadArtifact).toHaveBeenCalledWith("Token");
		expect(mockReadContractFn).toHaveBeenCalledWith({
			address: mockContractAddress,
			functionName: "balanceOf",
			abi: mockArtifact.abi,
			args,
		});
	});

	it("returns the result from publicClient.readContract", async () => {
		const mockArtifact = {
			abi: [
				{
					type: "function",
					name: "totalSupply",
					outputs: [{ type: "uint256" }],
				},
			],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		const expectedResult = 1000000n;
		mockReadContractFn.mockResolvedValue(expectedResult);

		const result = await readContract(
			mockHre,
			mockPublicClient,
			"Token",
			"totalSupply",
		);

		expect(result).toBe(expectedResult);
	});

	it("uses deployment address for the contract call", async () => {
		const customAddress =
			"0x9999999999999999999999999999999999999999" as Address;
		const mockArtifact = {
			abi: [{ type: "function", name: "owner" }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: customAddress,
			abi: mockArtifact.abi,
		});

		mockReadContractFn.mockResolvedValue("0xowner");

		await readContract(mockHre, mockPublicClient, "Ownable", "owner");

		expect(mockReadContractFn).toHaveBeenCalledWith(
			expect.objectContaining({
				address: customAddress,
			}),
		);
	});

	it("handles function with no arguments", async () => {
		const mockArtifact = {
			abi: [
				{
					type: "function",
					name: "decimals",
					inputs: [],
					outputs: [{ type: "uint8" }],
				},
			],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		mockReadContractFn.mockResolvedValue(18);

		await readContract(mockHre, mockPublicClient, "Token", "decimals");

		expect(mockReadContractFn).toHaveBeenCalledWith({
			address: mockContractAddress,
			functionName: "decimals",
			abi: mockArtifact.abi,
			args: [],
		});
	});

	it("handles function with multiple arguments", async () => {
		const mockArtifact = {
			abi: [
				{
					type: "function",
					name: "allowance",
					inputs: [{ type: "address" }, { type: "address" }],
					outputs: [{ type: "uint256" }],
				},
			],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		mockReadContractFn.mockResolvedValue(500n);

		const args = [
			"0x1111111111111111111111111111111111111111",
			"0x2222222222222222222222222222222222222222",
		];

		await readContract(mockHre, mockPublicClient, "Token", "allowance", args);

		expect(mockReadContractFn).toHaveBeenCalledWith({
			address: mockContractAddress,
			functionName: "allowance",
			abi: mockArtifact.abi,
			args,
		});
	});

	it("handles custom overrides", async () => {
		const mockArtifact = {
			abi: [
				{
					type: "function",
					name: "balanceOf",
					inputs: [{ type: "address" }],
				},
			],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		mockReadContractFn.mockResolvedValue(1000n);

		const overrides = {
			blockNumber: 12345n,
		};

		await readContract(
			mockHre,
			mockPublicClient,
			"Token",
			"balanceOf",
			["0x1111111111111111111111111111111111111111"],
			{ overrides },
		);

		expect(mockReadContractFn).toHaveBeenCalledWith({
			address: mockContractAddress,
			functionName: "balanceOf",
			abi: mockArtifact.abi,
			args: ["0x1111111111111111111111111111111111111111"],
			blockNumber: 12345n,
		});
	});

	it("uses artifact ABI for the contract call", async () => {
		const mockArtifact = {
			abi: [
				{ type: "function", name: "name", outputs: [{ type: "string" }] },
				{ type: "function", name: "symbol", outputs: [{ type: "string" }] },
				{
					type: "function",
					name: "totalSupply",
					outputs: [{ type: "uint256" }],
				},
			],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		mockReadContractFn.mockResolvedValue("MyToken");

		await readContract(mockHre, mockPublicClient, "Token", "name");

		expect(mockReadContractFn).toHaveBeenCalledWith(
			expect.objectContaining({
				abi: mockArtifact.abi,
			}),
		);
	});

	it("passes function name correctly", async () => {
		const mockArtifact = {
			abi: [{ type: "function", name: "paused", outputs: [{ type: "bool" }] }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		mockReadContractFn.mockResolvedValue(false);

		await readContract(mockHre, mockPublicClient, "Pausable", "paused");

		expect(mockReadContractFn).toHaveBeenCalledWith(
			expect.objectContaining({
				functionName: "paused",
			}),
		);
	});

	it("handles view functions returning complex types", async () => {
		const mockArtifact = {
			abi: [
				{
					type: "function",
					name: "tokenURI",
					inputs: [{ type: "uint256" }],
					outputs: [{ type: "string" }],
				},
			],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		const expectedUri = "ipfs://QmXxxx";
		mockReadContractFn.mockResolvedValue(expectedUri);

		const result = await readContract(
			mockHre,
			mockPublicClient,
			"NFT",
			"tokenURI",
			[42],
		);

		expect(result).toBe(expectedUri);
	});

	it("handles view functions returning structs", async () => {
		const mockArtifact = {
			abi: [
				{
					type: "function",
					name: "getInfo",
					outputs: [
						{
							type: "tuple",
							components: [
								{ name: "id", type: "uint256" },
								{ name: "name", type: "string" },
							],
						},
					],
				},
			],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		const expectedStruct = { id: 1n, name: "Test" };
		mockReadContractFn.mockResolvedValue(expectedStruct);

		const result = await readContract(
			mockHre,
			mockPublicClient,
			"Registry",
			"getInfo",
		);

		expect(result).toEqual(expectedStruct);
	});

	it("gets deployment before reading artifact", async () => {
		const mockArtifact = {
			abi: [{ type: "function", name: "test" }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		mockReadContractFn.mockResolvedValue(true);

		await readContract(mockHre, mockPublicClient, "Contract", "test");

		expect(getDeployment).toHaveBeenCalledWith(mockHre, "Contract");
		expect(mockReadArtifact).toHaveBeenCalledWith("Contract");
	});

	it("handles empty args array by default", async () => {
		const mockArtifact = {
			abi: [{ type: "function", name: "getValue" }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		mockReadContractFn.mockResolvedValue(42);

		await readContract(mockHre, mockPublicClient, "Contract", "getValue");

		expect(mockReadContractFn).toHaveBeenCalledWith(
			expect.objectContaining({
				args: [],
			}),
		);
	});
});
