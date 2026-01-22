import { type Config, getDefaultAccount } from "@midl/core";
import {
	type TransactionIntention,
	addTxIntention,
	getEVMAddress,
} from "@midl/executor";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { type Address, type PublicClient, encodeFunctionData } from "viem";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "~/actions/createStore";
import { getDeployment } from "~/actions/getDeployment";
import { writeContract } from "./writeContract";

vi.mock("@midl/core");
vi.mock("@midl/executor");
vi.mock("viem", async () => {
	const actual = await vi.importActual("viem");
	return {
		...actual,
		encodeFunctionData: vi.fn(),
	};
});
vi.mock("~/actions/getDeployment");

describe("writeContract", () => {
	const mockReadArtifact = vi.fn();
	const mockHre = {
		artifacts: {
			readArtifact: mockReadArtifact,
		},
	} as unknown as HardhatRuntimeEnvironment;

	const mockGetTransactionCount = vi.fn();
	const mockPublicClient = {
		getTransactionCount: mockGetTransactionCount,
	} as unknown as PublicClient;

	const mockConfig = {
		getState: vi.fn(() => ({
			network: "regtest",
		})),
	} as unknown as Config;

	const mockEvmAddress =
		"0x1234567890abcdef1234567890abcdef12345678" as Address;
	const mockContractAddress =
		"0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" as Address;

	const mockIntention = {
		type: "CALL",
		evmTransaction: {
			from: mockEvmAddress,
			to: mockContractAddress,
			data: "0xcalldata",
		},
	} as unknown as TransactionIntention;

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getDefaultAccount).mockReturnValue({
			address: "tb1qtest",
			publicKey: "0x123",
		} as ReturnType<typeof getDefaultAccount>);
		vi.mocked(getEVMAddress).mockReturnValue(mockEvmAddress);
		mockGetTransactionCount.mockResolvedValue(5);
		vi.mocked(encodeFunctionData).mockReturnValue(
			"0xcalldata" as `0x${string}`,
		);
		vi.mocked(addTxIntention).mockResolvedValue(mockIntention);
	});

	it("throws error if contract is not deployed", async () => {
		vi.mocked(getDeployment).mockResolvedValue(null);

		const store = createStore();

		await expect(
			writeContract(
				mockHre,
				mockConfig,
				store,
				mockPublicClient,
				"NonExistentContract",
				"transfer",
			),
		).rejects.toThrow("Contract NonExistentContract is not deployed");
	});

	it("reads artifact and encodes function call", async () => {
		const mockArtifact = {
			abi: [
				{
					type: "function",
					name: "transfer",
					inputs: [{ type: "address" }, { type: "uint256" }],
				},
			],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		const store = createStore();
		const args = ["0x1111111111111111111111111111111111111111", 1000];

		await writeContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"Token",
			"transfer",
			args,
		);

		expect(mockReadArtifact).toHaveBeenCalledWith("Token");
		expect(encodeFunctionData).toHaveBeenCalledWith({
			abi: mockArtifact.abi,
			functionName: "transfer",
			args,
		});
	});

	it("adds transaction intention with correct data", async () => {
		const mockArtifact = {
			abi: [{ type: "function", name: "mint" }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		const store = createStore();
		await writeContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"NFT",
			"mint",
		);

		expect(addTxIntention).toHaveBeenCalledWith(mockConfig, {
			evmTransaction: {
				to: mockContractAddress,
				data: "0xcalldata",
				nonce: 5,
			},
		});
	});

	it("adds intention to store", async () => {
		const mockArtifact = {
			abi: [{ type: "function", name: "burn" }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		const store = createStore();
		expect(store.getState().intentions).toHaveLength(0);

		await writeContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"Token",
			"burn",
		);

		expect(store.getState().intentions).toHaveLength(1);
		expect(store.getState().intentions[0]).toEqual(mockIntention);
	});

	it("returns the transaction intention", async () => {
		const mockArtifact = {
			abi: [{ type: "function", name: "approve" }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		const store = createStore();
		const result = await writeContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"Token",
			"approve",
		);

		expect(result).toEqual(mockIntention);
	});

	it("uses deployment address as transaction target", async () => {
		const customAddress =
			"0x9999999999999999999999999999999999999999" as Address;
		const mockArtifact = {
			abi: [{ type: "function", name: "pause" }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: customAddress,
			abi: mockArtifact.abi,
		});

		const store = createStore();
		await writeContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"Pausable",
			"pause",
		);

		expect(addTxIntention).toHaveBeenCalledWith(
			mockConfig,
			expect.objectContaining({
				evmTransaction: expect.objectContaining({
					to: customAddress,
				}),
			}),
		);
	});

	it("handles function with no arguments", async () => {
		const mockArtifact = {
			abi: [{ type: "function", name: "claim", inputs: [] }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		const store = createStore();
		await writeContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"Airdrop",
			"claim",
		);

		expect(encodeFunctionData).toHaveBeenCalledWith({
			abi: mockArtifact.abi,
			functionName: "claim",
			args: [],
		});
	});

	it("handles function with multiple arguments", async () => {
		const mockArtifact = {
			abi: [
				{
					type: "function",
					name: "safeTransferFrom",
					inputs: [
						{ type: "address" },
						{ type: "address" },
						{ type: "uint256" },
					],
				},
			],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		const store = createStore();
		const args = [
			"0x1111111111111111111111111111111111111111",
			"0x2222222222222222222222222222222222222222",
			42,
		];

		await writeContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"NFT",
			"safeTransferFrom",
			args,
		);

		expect(encodeFunctionData).toHaveBeenCalledWith({
			abi: mockArtifact.abi,
			functionName: "safeTransferFrom",
			args,
		});
	});

	it("handles custom overrides", async () => {
		const mockArtifact = {
			abi: [{ type: "function", name: "mint" }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		const store = createStore();
		await writeContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"NFT",
			"mint",
			[],
			{ value: 1000n, gas: 50000n },
		);

		expect(addTxIntention).toHaveBeenCalledWith(mockConfig, {
			evmTransaction: {
				to: mockContractAddress,
				data: "0xcalldata",
				nonce: 5,
				value: 1000n,
				gas: 50000n,
			},
		});
	});

	it("uses custom nonce when provided", async () => {
		const mockArtifact = {
			abi: [{ type: "function", name: "withdraw" }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		const customNonce = 100;
		const store = createStore();
		await writeContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"Vault",
			"withdraw",
			[],
			{
				nonce: customNonce,
			},
		);

		expect(addTxIntention).toHaveBeenCalledWith(
			mockConfig,
			expect.objectContaining({
				evmTransaction: expect.objectContaining({
					nonce: customNonce,
				}),
			}),
		);
	});

	it("uses custom from address when provided", async () => {
		const mockArtifact = {
			abi: [{ type: "function", name: "delegate" }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		const customFrom = "0xfedcba0987654321fedcba0987654321fedcba09" as Address;
		const store = createStore();
		await writeContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"Governance",
			"delegate",
			[],
			{
				from: customFrom,
			},
		);

		expect(mockGetTransactionCount).toHaveBeenCalledWith({
			address: customFrom,
		});
	});

	it("calculates nonce with pending intentions", async () => {
		const mockArtifact = {
			abi: [{ type: "function", name: "execute" }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		const store = createStore();

		// Add first intention
		await writeContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"Contract",
			"execute",
		);

		// Second call should increment nonce
		await writeContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"Contract",
			"execute",
		);

		const calls = vi.mocked(addTxIntention).mock.calls;
		expect(calls[0][1]).toMatchObject({
			evmTransaction: expect.objectContaining({ nonce: 5 }),
		});
		expect(calls[1][1]).toMatchObject({
			evmTransaction: expect.objectContaining({ nonce: 6 }),
		});
	});

	it("gets transaction count from correct address", async () => {
		const mockArtifact = {
			abi: [{ type: "function", name: "stake" }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		const store = createStore();
		await writeContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"Staking",
			"stake",
		);

		expect(mockGetTransactionCount).toHaveBeenCalledWith({
			address: mockEvmAddress,
		});
	});

	it("uses getEVMAddress when from not provided", async () => {
		const mockArtifact = {
			abi: [{ type: "function", name: "vote" }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		vi.mocked(getDeployment).mockResolvedValue({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});

		const store = createStore();
		await writeContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"DAO",
			"vote",
		);

		expect(getEVMAddress).toHaveBeenCalled();
		expect(getDefaultAccount).toHaveBeenCalledWith(mockConfig);
	});
});
