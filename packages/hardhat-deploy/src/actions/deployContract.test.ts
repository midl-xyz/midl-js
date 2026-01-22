import { type Account, type Config, getDefaultAccount } from "@midl/core";
import {
	type TransactionIntention,
	addTxIntention,
	getEVMAddress,
} from "@midl/executor";
import { resolveBytecodeWithLinkedLibraries } from "@nomicfoundation/hardhat-viem/internal/bytecode";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import {
	type Address,
	type PublicClient,
	encodeDeployData,
	getContractAddress,
} from "viem";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "~/actions/createStore";
import { getDeployment } from "~/actions/getDeployment";
import { deployContract } from "./deployContract";

vi.mock("@midl/core");
vi.mock("@midl/executor");
vi.mock("@nomicfoundation/hardhat-viem/internal/bytecode");
vi.mock("viem", async () => {
	const actual = await vi.importActual("viem");
	return {
		...actual,
		encodeDeployData: vi.fn(),
		getContractAddress: vi.fn(),
	};
});
vi.mock("~/actions/getDeployment");

describe("deployContract", () => {
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

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getDeployment).mockResolvedValue(null);
		vi.mocked(getDefaultAccount).mockReturnValue({
			address: "tb1qtest",
			publicKey: "0x123",
		} as unknown as Account);
		vi.mocked(getEVMAddress).mockReturnValue(mockEvmAddress);
		mockGetTransactionCount.mockResolvedValue(5);
		vi.mocked(getContractAddress).mockReturnValue(mockContractAddress);
		vi.mocked(encodeDeployData).mockReturnValue(
			"0xdeploydata" as `0x${string}`,
		);
		vi.mocked(resolveBytecodeWithLinkedLibraries).mockResolvedValue(
			"0xbytecode",
		);
		vi.mocked(addTxIntention).mockResolvedValue({
			evmTransaction: {
				from: mockEvmAddress,
				data: "0xdeploydata",
			},
		} as unknown as TransactionIntention);
	});

	it("returns existing deployment if already deployed", async () => {
		const existingDeployment = {
			address: "0xexisting" as Address,
			abi: [{ type: "function", name: "test" }],
		};

		vi.mocked(getDeployment).mockResolvedValue(existingDeployment);

		const store = createStore();
		const result = await deployContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"ExistingContract",
		);

		expect(result).toEqual(existingDeployment);
		expect(mockReadArtifact).not.toHaveBeenCalled();
		expect(addTxIntention).not.toHaveBeenCalled();
	});

	it("reads artifact and deploys when no existing deployment", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor" }],
			bytecode: "0x123456",
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const store = createStore();
		await deployContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"NewContract",
		);

		expect(mockReadArtifact).toHaveBeenCalledWith("NewContract");
		expect(resolveBytecodeWithLinkedLibraries).toHaveBeenCalledWith(
			mockArtifact,
			{},
		);
	});

	it("encodes deploy data with correct parameters", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor", inputs: [] }],
			bytecode: "0x123456",
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const store = createStore();
		const args = [100, "test"];

		await deployContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"ContractWithArgs",
			args,
		);

		expect(encodeDeployData).toHaveBeenCalledWith({
			abi: mockArtifact.abi,
			args: args,
			bytecode: "0xbytecode",
		});
	});

	it("adds transaction intention with correct data", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor" }],
			bytecode: "0x123456",
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const store = createStore();
		await deployContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"IntentionContract",
		);

		expect(addTxIntention).toHaveBeenCalledWith(mockConfig, {
			evmTransaction: {
				data: "0xdeploydata",
				nonce: 5,
				from: mockEvmAddress,
			},
			meta: {
				contractName: "IntentionContract",
			},
		});
	});

	it("adds intention to store", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor" }],
			bytecode: "0x123456",
		};

		mockReadArtifact.mockResolvedValue(mockArtifact);

		const store = createStore();
		expect(store.getState().intentions).toHaveLength(0);

		await deployContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"StoreContract",
		);

		expect(store.getState().intentions).toHaveLength(1);
	});

	it("calculates contract address with correct nonce", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor" }],
			bytecode: "0x123456",
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const store = createStore();
		await deployContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"NonceContract",
		);

		expect(mockGetTransactionCount).toHaveBeenCalledWith({
			address: mockEvmAddress,
		});

		expect(getContractAddress).toHaveBeenCalledWith({
			from: mockEvmAddress,
			nonce: 5n, // nonce (5) + totalIntentions (1) - 1 = 5
		});
	});

	it("returns deployment data with address and abi", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor" }, { type: "function", name: "transfer" }],
			bytecode: "0x123456",
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const store = createStore();
		const result = await deployContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"ReturnContract",
		);

		expect(result).toEqual({
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});
	});

	it("handles linked libraries", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor" }],
			bytecode: "0x123456",
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const libraries = {
			LibraryA: "0x1111111111111111111111111111111111111111" as Address,
			LibraryB: "0x2222222222222222222222222222222222222222" as Address,
		};

		const store = createStore();
		await deployContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"LinkedContract",
			[],
			{ libraries },
		);

		expect(resolveBytecodeWithLinkedLibraries).toHaveBeenCalledWith(
			mockArtifact,
			libraries,
		);
	});

	it("handles custom overrides", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor" }],
			bytecode: "0x123456",
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const store = createStore();
		await deployContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"OverridesContract",
			[],
			{
				value: 1000n,
				gas: 21000n,
			},
		);

		expect(addTxIntention).toHaveBeenCalledWith(mockConfig, {
			evmTransaction: {
				data: "0xdeploydata",
				value: 1000n,
				gas: 21000n,
				nonce: 5,
				from: mockEvmAddress,
			},
			meta: {
				contractName: "OverridesContract",
			},
		});
	});

	it("uses custom nonce from intention if provided", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor" }],
			bytecode: "0x123456",
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const customNonce = 100;

		const store = createStore();
		await deployContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"CustomNonceContract",
			[],
			{
				nonce: customNonce,
			},
		);

		expect(getContractAddress).toHaveBeenCalledWith({
			from: mockEvmAddress,
			nonce: BigInt(customNonce),
		});
	});

	it("uses evmTransaction.from when available", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor" }],
			bytecode: "0x123456",
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const customFrom = "0xfedcba0987654321fedcba0987654321fedcba09" as Address;

		const store = createStore();
		await deployContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"CustomFromContract",
			[],
			{
				from: customFrom,
			},
		);

		expect(mockGetTransactionCount).toHaveBeenCalledWith({
			address: customFrom,
		});

		expect(getContractAddress).toHaveBeenCalledWith(
			expect.objectContaining({
				from: customFrom,
			}),
		);
	});

	it("handles multiple deployments with incremented nonce", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor" }],
			bytecode: "0x123456",
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const store = createStore();

		// First deployment
		await deployContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"Contract1",
		);

		expect(getContractAddress).toHaveBeenCalledWith({
			from: mockEvmAddress,
			nonce: 5n, // base nonce + 0
		});

		// Second deployment
		await deployContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"Contract2",
			[],
			{
				value: 500n,
			},
			{},
		);

		expect(getContractAddress).toHaveBeenCalledWith({
			from: mockEvmAddress,
			nonce: 6n, // base nonce + 1
		});
	});

	it("handles empty constructor args", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor", inputs: [] }],
			bytecode: "0x123456",
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const store = createStore();
		await deployContract(
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			"NoArgsContract",
		);

		expect(encodeDeployData).toHaveBeenCalledWith({
			abi: mockArtifact.abi,
			args: [],
			bytecode: "0xbytecode",
		});
	});
});
