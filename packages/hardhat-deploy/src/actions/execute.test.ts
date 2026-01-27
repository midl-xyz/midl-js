import * as core from "@midl/core";
import {
	AddressPurpose,
	connect,
	createConfig,
	getDefaultAccount,
	regtest,
} from "@midl/core";
import type {
	FinalizeBTCTransactionOptions,
	TransactionIntention,
	Withdrawal,
} from "@midl/executor";
import { getEVMAddress } from "@midl/executor";
import { keyPairConnector } from "@midl/node";
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

vi.mock("@midl/executor", async () => {
	const actual =
		await vi.importActual<typeof import("@midl/executor")>("@midl/executor");

	return {
		...actual,
		finalizeBTCTransaction: vi.fn(),
		signIntention: vi.fn(),
		addCompleteTxIntention: vi.fn(),
	};
});

vi.mock("~/actions/saveDeployment", () => ({
	saveDeployment: vi.fn(),
}));

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

	const mockUserConfig: MidlNetworkConfig = {
		confirmationsRequired: 1,
		btcConfirmationsRequired: 1,
	} as MidlNetworkConfig;

	const mockBtcTxId = "btc-tx-id-123";
	const mockBtcTxHex = "0102030405";
	const signedTxA = "0x0701" as `0x07${string}`;
	const signedTxB = "0x0702" as `0x07${string}`;

	const createConnectedConfig = async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [keyPairConnector({ mnemonic: TEST_MNEMONIC })],
		});

		await connect(config, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});

		return config;
	};

	beforeEach(async () => {
		vi.restoreAllMocks();
		vi.clearAllMocks();

		mockGetTransactionCount.mockResolvedValue(5);
		mockSendBTCTransactions.mockResolvedValue(undefined);
		mockWaitForTransactionReceipt.mockResolvedValue(
			{} as Awaited<ReturnType<PublicClient["waitForTransactionReceipt"]>>,
		);

		const { finalizeBTCTransaction, signIntention } = await import(
			"@midl/executor"
		);

		vi.mocked(finalizeBTCTransaction).mockResolvedValue({
			tx: { id: mockBtcTxId, hex: mockBtcTxHex },
		} as Awaited<ReturnType<typeof finalizeBTCTransaction>>);

		vi.mocked(signIntention).mockResolvedValue(signedTxA);

		vi.spyOn(core, "waitForTransaction").mockResolvedValue(1);
	});

	it("returns null when no intentions to execute", async () => {
		const config = await createConnectedConfig();
		const store = createStore();

		const result = await execute(
			mockUserConfig,
			mockHre,
			config,
			store,
			mockPublicClient,
		);

		expect(result).toBeNull();
	});

	it("finalizes BTC transaction with intentions", async () => {
		const { finalizeBTCTransaction } = await import("@midl/executor");
		const config = await createConnectedConfig();
		const store = createStore();
		const mockIntention = {
			evmTransaction: {
				data: "0x123",
			},
		} as unknown as TransactionIntention;

		store.setState({ intentions: [mockIntention] });

		await execute(mockUserConfig, mockHre, config, store, mockPublicClient);

		expect(finalizeBTCTransaction).toHaveBeenCalledWith(
			config,
			[mockIntention],
			mockPublicClient,
			{},
		);
	});

	it("signs each intention and sends BTC transactions", async () => {
		const { signIntention } = await import("@midl/executor");
		const config = await createConnectedConfig();
		const store = createStore();
		const mockIntention = {
			evmTransaction: {
				data: "0x123",
			},
		} as unknown as TransactionIntention;

		store.setState({ intentions: [mockIntention] });

		await execute(mockUserConfig, mockHre, config, store, mockPublicClient);

		expect(signIntention).toHaveBeenCalledTimes(1);
		expect(mockSendBTCTransactions).toHaveBeenCalledWith({
			btcTransaction: mockBtcTxHex,
			serializedTransactions: [signedTxA],
		});
	});

	it("waits for BTC confirmation and EVM receipts", async () => {
		const config = await createConnectedConfig();
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
			config,
			store,
			mockPublicClient,
		);

		const expectedHash = keccak256(signedTxA);
		expect(mockWaitForTransactionReceipt).toHaveBeenCalledWith({
			hash: expectedHash,
			confirmations: mockUserConfig.confirmationsRequired,
		});
		expect(result).toEqual([mockBtcTxId, [expectedHash]]);
	});

	it("clears intentions from store after execution", async () => {
		const config = await createConnectedConfig();
		const store = createStore();
		const mockIntention = {
			evmTransaction: {
				data: "0x123",
			},
		} as unknown as TransactionIntention;

		store.setState({ intentions: [mockIntention] });
		expect(store.getState().intentions).toHaveLength(1);

		await execute(mockUserConfig, mockHre, config, store, mockPublicClient);

		expect(store.getState().intentions).toHaveLength(0);
	});

	it("saves deployment when intention has contractName meta", async () => {
		const { signIntention } = await import("@midl/executor");
		vi.mocked(signIntention).mockResolvedValueOnce(signedTxB);

		const config = await createConnectedConfig();
		const store = createStore();
		const mockArtifact = {
			abi: [{ type: "constructor" }],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

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

		await execute(mockUserConfig, mockHre, config, store, mockPublicClient);

		const evmAddress = getEVMAddress(
			getDefaultAccount(config),
			config.getState().network,
		);
		const expectedAddress = getContractAddress({
			from: evmAddress,
			nonce: 10n,
		});
		const expectedHash = keccak256(signedTxB);

		expect(mockReadArtifact).toHaveBeenCalledWith("MyContract");
		expect(saveDeployment).toHaveBeenCalledWith(mockHre, "MyContract", {
			txId: expectedHash,
			btcTxId: mockBtcTxId,
			address: expectedAddress,
			abi: mockArtifact.abi,
		});
	});

	it("adds complete transaction when withdraw is true", async () => {
		const { addCompleteTxIntention, finalizeBTCTransaction } = await import(
			"@midl/executor"
		);
		const config = await createConnectedConfig();
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

		await execute(mockUserConfig, mockHre, config, store, mockPublicClient, {
			withdraw: true,
		});

		expect(addCompleteTxIntention).toHaveBeenCalledWith(config, undefined);
		expect(finalizeBTCTransaction).toHaveBeenCalledWith(
			config,
			[mockIntention, mockCompleteTx],
			mockPublicClient,
			{},
		);
	});

	it("adds complete transaction with withdrawal details", async () => {
		const { addCompleteTxIntention } = await import("@midl/executor");
		const config = await createConnectedConfig();
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

		await execute(mockUserConfig, mockHre, config, store, mockPublicClient, {
			withdraw: withdrawal,
		});

		expect(addCompleteTxIntention).toHaveBeenCalledWith(config, withdrawal);
	});

	it("passes overrides to finalizeBTCTransaction", async () => {
		const { finalizeBTCTransaction } = await import("@midl/executor");
		const config = await createConnectedConfig();
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
			config,
			store,
			mockPublicClient,
			overrides,
		);

		expect(finalizeBTCTransaction).toHaveBeenCalledWith(
			config,
			[mockIntention],
			mockPublicClient,
			overrides,
		);
	});

	it("uses custom from address when provided in intention", async () => {
		const config = await createConnectedConfig();
		const store = createStore();
		const customFrom = "0xfedcba0987654321fedcba0987654321fedcba09" as Address;
		const mockIntention = {
			evmTransaction: {
				from: customFrom,
				data: "0x123",
			},
		} as unknown as TransactionIntention;

		store.setState({ intentions: [mockIntention] });

		await execute(mockUserConfig, mockHre, config, store, mockPublicClient);

		expect(mockGetTransactionCount).toHaveBeenCalledWith({
			address: customFrom,
		});
	});

	it("waits for all EVM transaction receipts in parallel", async () => {
		const { signIntention } = await import("@midl/executor");
		vi.mocked(signIntention)
			.mockResolvedValueOnce(signedTxA)
			.mockResolvedValueOnce(signedTxB);

		const config = await createConnectedConfig();
		const store = createStore();
		const intentions = [
			{ evmTransaction: { data: "0x111" } },
			{ evmTransaction: { data: "0x222" } },
		] as unknown as TransactionIntention[];

		store.setState({ intentions });

		await execute(mockUserConfig, mockHre, config, store, mockPublicClient);

		expect(mockWaitForTransactionReceipt).toHaveBeenCalledTimes(2);
		expect(mockWaitForTransactionReceipt).toHaveBeenCalledWith({
			hash: keccak256(signedTxA),
			confirmations: mockUserConfig.confirmationsRequired,
		});
		expect(mockWaitForTransactionReceipt).toHaveBeenCalledWith({
			hash: keccak256(signedTxB),
			confirmations: mockUserConfig.confirmationsRequired,
		});
	});
});

const TEST_MNEMONIC =
	"test test test test test test test test test test test junk";
