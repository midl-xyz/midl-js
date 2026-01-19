import {
	type Config,
	SignMessageProtocol,
	getDefaultAccount,
	waitForTransaction,
} from "@midl/core";
import {
	type FinalizeBTCTransactionOptions,
	type TransactionIntention,
	type Withdrawal,
	addCompleteTxIntention,
	finalizeBTCTransaction,
	getEVMAddress,
	signIntention,
} from "@midl/executor";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import {
	type Address,
	type PublicClient,
	getContractAddress,
	keccak256,
} from "viem";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "~/actions/createStore";
import { saveDeployment } from "~/actions/saveDeployment";
import type { MidlNetworkConfig } from "~/type-extensions";
import { execute } from "./execute";

vi.mock("@midl/core");
vi.mock("@midl/executor");
vi.mock("viem", async () => {
	const actual = await vi.importActual("viem");
	return {
		...actual,
		getContractAddress: vi.fn(),
		keccak256: vi.fn(),
	};
});
vi.mock("~/actions/saveDeployment");

describe("execute", () => {
	const mockReadArtifact = vi.fn();
	const mockHre = {
		artifacts: {
			readArtifact: mockReadArtifact,
		},
	} as unknown as HardhatRuntimeEnvironment;

	const mockSendBTCTransactions = vi.fn();
	const mockWaitForTransactionReceipt = vi.fn();
	const mockGetTransactionCount = vi.fn();
	const mockPublicClient = {
		sendBTCTransactions: mockSendBTCTransactions,
		waitForTransactionReceipt: mockWaitForTransactionReceipt,
		getTransactionCount: mockGetTransactionCount,
	} as unknown as PublicClient;

	const mockConfig = {
		getState: vi.fn(() => ({
			network: "regtest",
		})),
	} as unknown as Config;

	const mockUserConfig: MidlNetworkConfig = {
		confirmationsRequired: 1,
		btcConfirmationsRequired: 1,
	} as MidlNetworkConfig;

	const mockEvmAddress =
		"0x1234567890abcdef1234567890abcdef12345678" as Address;
	const mockContractAddress =
		"0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" as Address;

	const mockTxId = "0xabc123" as `0x${string}`;
	const mockSignedTx = "0x07signed" as `0x07${string}`;
	const mockBtcTxId = "btc-tx-id-123";
	const mockBtcTxHex = "0102030405";

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getDefaultAccount).mockReturnValue({
			address: "tb1qtest",
			publicKey: "0x123",
		} as ReturnType<typeof getDefaultAccount>);
		vi.mocked(getEVMAddress).mockReturnValue(mockEvmAddress);
		mockGetTransactionCount.mockResolvedValue(5);
		vi.mocked(getContractAddress).mockReturnValue(mockContractAddress);
		vi.mocked(keccak256).mockReturnValue(mockTxId);
		vi.mocked(finalizeBTCTransaction).mockResolvedValue({
			tx: { id: mockBtcTxId, hex: mockBtcTxHex },
		} as Awaited<ReturnType<typeof finalizeBTCTransaction>>);
		vi.mocked(signIntention).mockResolvedValue(mockSignedTx);
		mockSendBTCTransactions.mockResolvedValue(undefined);
		mockWaitForTransactionReceipt.mockResolvedValue(
			{} as Awaited<ReturnType<PublicClient["waitForTransactionReceipt"]>>,
		);
		vi.mocked(waitForTransaction).mockResolvedValue(1);
		vi.mocked(saveDeployment).mockResolvedValue(undefined);
	});

	it("throws error when no intentions to execute", async () => {
		const store = createStore();

		await expect(
			execute(mockUserConfig, mockHre, mockConfig, store, mockPublicClient),
		).rejects.toThrow("No intentions to execute");
	});

	it("finalizes BTC transaction with intentions", async () => {
		const store = createStore();
		const mockIntention = {
			evmTransaction: {
				data: "0x123",
			},
		} as unknown as TransactionIntention;

		store.setState({ intentions: [mockIntention] });

		await execute(mockUserConfig, mockHre, mockConfig, store, mockPublicClient);

		expect(finalizeBTCTransaction).toHaveBeenCalledWith(
			mockConfig,
			[mockIntention],
			mockPublicClient,
			{},
		);
	});

	it("signs each intention with correct parameters", async () => {
		const store = createStore();
		const mockIntention = {
			evmTransaction: {
				data: "0x123",
			},
		} as unknown as TransactionIntention;

		store.setState({ intentions: [mockIntention] });

		await execute(mockUserConfig, mockHre, mockConfig, store, mockPublicClient);

		expect(signIntention).toHaveBeenCalledWith(
			mockConfig,
			mockPublicClient,
			mockIntention,
			[mockIntention],
			{
				txId: mockBtcTxId,
				protocol: SignMessageProtocol.Bip322,
			},
		);
	});

	it("sends BTC transactions with signed data", async () => {
		const store = createStore();
		const mockIntention = {
			evmTransaction: {
				data: "0x123",
			},
		} as unknown as TransactionIntention;

		store.setState({ intentions: [mockIntention] });

		await execute(mockUserConfig, mockHre, mockConfig, store, mockPublicClient);

		expect(mockSendBTCTransactions).toHaveBeenCalledWith({
			btcTransaction: mockBtcTxHex,
			serializedTransactions: [mockSignedTx],
		});
	});

	it("waits for BTC transaction confirmation", async () => {
		const store = createStore();
		const mockIntention = {
			evmTransaction: {
				data: "0x123",
			},
		} as unknown as TransactionIntention;

		store.setState({ intentions: [mockIntention] });

		await execute(mockUserConfig, mockHre, mockConfig, store, mockPublicClient);

		expect(waitForTransaction).toHaveBeenCalledWith(
			mockConfig,
			mockBtcTxId,
			mockUserConfig.btcConfirmationsRequired,
		);
	});

	it("waits for EVM transaction receipts", async () => {
		const store = createStore();
		const mockIntention = {
			evmTransaction: {
				data: "0x123",
			},
		} as unknown as TransactionIntention;

		store.setState({ intentions: [mockIntention] });

		await execute(mockUserConfig, mockHre, mockConfig, store, mockPublicClient);

		expect(mockWaitForTransactionReceipt).toHaveBeenCalledWith({
			hash: mockTxId,
			confirmations: mockUserConfig.confirmationsRequired,
		});
	});

	it("clears intentions from store after execution", async () => {
		const store = createStore();
		const mockIntention = {
			evmTransaction: {
				data: "0x123",
			},
		} as unknown as TransactionIntention;

		store.setState({ intentions: [mockIntention] });
		expect(store.getState().intentions).toHaveLength(1);

		await execute(mockUserConfig, mockHre, mockConfig, store, mockPublicClient);

		expect(store.getState().intentions).toHaveLength(0);
	});

	it("returns BTC transaction ID and EVM transaction hashes", async () => {
		const store = createStore();
		const mockIntention = {
			evmTransaction: {
				data: "0x123",
			},
		} as unknown as TransactionIntention;

		store.setState({ intentions: [mockIntention] });

		const result = await execute(
			mockUserConfig,
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
		);

		expect(result).toEqual([mockBtcTxId, [mockTxId]]);
	});

	it("saves deployment when intention has contractName meta", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor" }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const store = createStore();
		const mockIntention = {
			evmTransaction: {
				data: "0x123",
				nonce: 10,
			},
			meta: {
				contractName: "MyContract",
			},
		} as unknown as TransactionIntention;

		store.setState({ intentions: [mockIntention] });

		await execute(mockUserConfig, mockHre, mockConfig, store, mockPublicClient);

		expect(mockReadArtifact).toHaveBeenCalledWith("MyContract");
		expect(saveDeployment).toHaveBeenCalledWith(mockHre, "MyContract", {
			txId: mockTxId,
			btcTxId: mockBtcTxId,
			address: mockContractAddress,
			abi: mockArtifact.abi,
		});
	});

	it("does not save deployment when intention has no contractName", async () => {
		const store = createStore();
		const mockIntention = {
			evmTransaction: {
				data: "0x123",
			},
		} as unknown as TransactionIntention;

		store.setState({ intentions: [mockIntention] });

		await execute(mockUserConfig, mockHre, mockConfig, store, mockPublicClient);

		expect(mockReadArtifact).not.toHaveBeenCalled();
		expect(saveDeployment).not.toHaveBeenCalled();
	});

	it("handles multiple intentions", async () => {
		const store = createStore();
		const intentions = [
			{
				evmTransaction: { data: "0x111" },
			},
			{
				evmTransaction: { data: "0x222" },
			},
			{
				evmTransaction: { data: "0x333" },
			},
		] as unknown as TransactionIntention[];

		store.setState({ intentions });

		const mockTxIds = ["0xhash1", "0xhash2", "0xhash3"] as `0x${string}`[];
		vi.mocked(keccak256)
			.mockReturnValueOnce(mockTxIds[0])
			.mockReturnValueOnce(mockTxIds[1])
			.mockReturnValueOnce(mockTxIds[2]);

		const result = await execute(
			mockUserConfig,
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
		);

		expect(signIntention).toHaveBeenCalledTimes(3);
		expect(result[1]).toEqual(mockTxIds);
	});

	it("adds complete transaction when withdraw is true", async () => {
		const store = createStore();
		const mockIntention = {
			evmTransaction: {
				data: "0x123",
			},
		} as unknown as TransactionIntention;

		const mockCompleteTx = {
			evmTransaction: {
				data: "0xcomplete",
			},
		} as unknown as TransactionIntention;

		vi.mocked(addCompleteTxIntention).mockResolvedValue(mockCompleteTx);

		store.setState({ intentions: [mockIntention] });

		await execute(
			mockUserConfig,
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			{ withdraw: true },
		);

		expect(addCompleteTxIntention).toHaveBeenCalledWith(mockConfig, undefined);
		expect(finalizeBTCTransaction).toHaveBeenCalledWith(
			mockConfig,
			[mockIntention, mockCompleteTx],
			mockPublicClient,
			undefined,
		);
	});

	it("adds complete transaction with withdrawal details", async () => {
		const store = createStore();
		const mockIntention = {
			evmTransaction: {
				data: "0x123",
			},
		} as unknown as TransactionIntention;

		const withdrawal: Withdrawal = {
			satoshis: 100000,
		};

		const mockCompleteTx = {
			evmTransaction: {
				data: "0xcomplete",
			},
		} as unknown as TransactionIntention;

		vi.mocked(addCompleteTxIntention).mockResolvedValue(mockCompleteTx);

		store.setState({ intentions: [mockIntention] });

		await execute(
			mockUserConfig,
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			{ withdraw: withdrawal },
		);

		expect(addCompleteTxIntention).toHaveBeenCalledWith(mockConfig, withdrawal);
	});

	it("passes overrides to finalizeBTCTransaction", async () => {
		const store = createStore();
		const mockIntention = {
			evmTransaction: {
				data: "0x123",
			},
		} as unknown as TransactionIntention;

		const overrides: FinalizeBTCTransactionOptions = {
			feeRate: 10,
		};

		store.setState({ intentions: [mockIntention] });

		await execute(
			mockUserConfig,
			mockHre,
			mockConfig,
			store,
			mockPublicClient,
			{ overrides },
		);

		expect(finalizeBTCTransaction).toHaveBeenCalledWith(
			mockConfig,
			[mockIntention],
			mockPublicClient,
			overrides,
		);
	});

	it("uses custom from address when provided in intention", async () => {
		const customFrom = "0xfedcba0987654321fedcba0987654321fedcba09" as Address;
		const store = createStore();
		const mockIntention = {
			evmTransaction: {
				from: customFrom,
				data: "0x123",
			},
		} as unknown as TransactionIntention;

		store.setState({ intentions: [mockIntention] });

		await execute(mockUserConfig, mockHre, mockConfig, store, mockPublicClient);

		expect(mockGetTransactionCount).toHaveBeenCalledWith({
			address: customFrom,
		});
	});

	it("uses custom nonce when provided in intention", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor" }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const store = createStore();
		const customNonce = 99;
		const mockIntention = {
			evmTransaction: {
				data: "0x123",
				nonce: customNonce,
			},
			meta: {
				contractName: "CustomNonceContract",
			},
		} as unknown as TransactionIntention;

		store.setState({ intentions: [mockIntention] });

		await execute(mockUserConfig, mockHre, mockConfig, store, mockPublicClient);

		expect(getContractAddress).toHaveBeenCalledWith({
			from: mockEvmAddress,
			nonce: BigInt(customNonce),
		});
	});

	it("waits for all EVM transaction receipts in parallel", async () => {
		const store = createStore();
		const intentions = [
			{ evmTransaction: { data: "0x111" } },
			{ evmTransaction: { data: "0x222" } },
		] as unknown as TransactionIntention[];

		const mockTxIds = ["0xhash1", "0xhash2"] as `0x${string}`[];
		vi.mocked(keccak256)
			.mockReturnValueOnce(mockTxIds[0])
			.mockReturnValueOnce(mockTxIds[1]);

		store.setState({ intentions });

		await execute(mockUserConfig, mockHre, mockConfig, store, mockPublicClient);

		expect(mockWaitForTransactionReceipt).toHaveBeenCalledTimes(2);
		expect(mockWaitForTransactionReceipt).toHaveBeenCalledWith({
			hash: mockTxIds[0],
			confirmations: mockUserConfig.confirmationsRequired,
		});
		expect(mockWaitForTransactionReceipt).toHaveBeenCalledWith({
			hash: mockTxIds[1],
			confirmations: mockUserConfig.confirmationsRequired,
		});
	});

	it("clones intentions to avoid mutation", async () => {
		const store = createStore();
		const originalIntention = {
			evmTransaction: {
				data: "0x123",
			},
		} as unknown as TransactionIntention;

		store.setState({ intentions: [originalIntention] });

		await execute(mockUserConfig, mockHre, mockConfig, store, mockPublicClient);

		// Verify the original intention wasn't modified
		expect(originalIntention).toEqual({
			evmTransaction: {
				data: "0x123",
			},
		});
	});
});
