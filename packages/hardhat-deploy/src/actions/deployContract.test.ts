import {
	AddressPurpose,
	connect,
	createConfig,
	getDefaultAccount,
	regtest,
} from "@midl/core";
import { getEVMAddress } from "@midl/executor";
import { keyPairConnector } from "@midl/node";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import {
	type Address,
	encodeDeployData,
	getContractAddress,
	type PublicClient,
} from "viem";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "~/actions/createStore";
import { getDeployment } from "~/actions/getDeployment";
import { deployContract } from "./deployContract";

vi.mock("~/actions/getDeployment", () => ({
	getDeployment: vi.fn(),
}));

vi.mock("@nomicfoundation/hardhat-viem/internal/bytecode", () => ({
	resolveBytecodeWithLinkedLibraries: vi.fn(
		async (artifact: { bytecode: string }) => artifact.bytecode,
	),
}));

const TEST_MNEMONIC =
	"test test test test test test test test test test test junk";

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

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getDeployment).mockResolvedValue(null);
		mockGetTransactionCount.mockResolvedValue(5);
	});

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

	it("returns existing deployment if already deployed", async () => {
		const existingDeployment = {
			address: "0x0000000000000000000000000000000000000001" as Address,
			abi: [{ type: "function", name: "test" }],
		};

		vi.mocked(getDeployment).mockResolvedValue(existingDeployment);

		const config = await createConnectedConfig();
		const store = createStore();
		const result = await deployContract(
			mockHre,
			config,
			store,
			mockPublicClient,
			"ExistingContract",
		);

		expect(result).toEqual(existingDeployment);
		expect(mockReadArtifact).not.toHaveBeenCalled();
	});

	it("adds a deployment intention and stores it with a derived address", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor", inputs: [] }],
			bytecode: "0x60006000",
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const config = await createConnectedConfig();
		const store = createStore();

		const result = await deployContract(
			mockHre,
			config,
			store,
			mockPublicClient,
			"NewContract",
		);

		expect(store.getState().intentions).toHaveLength(1);

		const intention = store.getState().intentions[0];
		expect(intention.meta?.contractName).toBe("NewContract");
		expect(intention.evmTransaction?.data).toBe(
			encodeDeployData({
				abi: mockArtifact.abi,
				args: [],
				bytecode: mockArtifact.bytecode as `0x${string}`,
			}),
		);
		expect(intention.evmTransaction?.nonce).toBe(5);

		const expectedFrom = getEVMAddress(
			getDefaultAccount(config),
			config.getState().network,
		);
		expect(intention.evmTransaction?.from).toBe(expectedFrom);

		const expectedAddress = getContractAddress({
			from: expectedFrom,
			nonce: 5n,
		});
		expect(result).toEqual({ address: expectedAddress, abi: mockArtifact.abi });
	});

	it("increments nonce based on pending intentions", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor", inputs: [] }],
			bytecode: "0x60006000",
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const config = await createConnectedConfig();
		const store = createStore();

		await deployContract(mockHre, config, store, mockPublicClient, "ContractA");
		await deployContract(mockHre, config, store, mockPublicClient, "ContractB");

		const nonces = store
			.getState()
			.intentions.map((it) => it.evmTransaction?.nonce);

		expect(nonces).toEqual([5, 6]);
	});

	it("respects an explicit nonce override", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor", inputs: [] }],
			bytecode: "0x60006000",
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const config = await createConnectedConfig();
		const store = createStore();

		await deployContract(
			mockHre,
			config,
			store,
			mockPublicClient,
			"ContractWithNonce",
			[],
			{ nonce: 42 },
		);

		expect(store.getState().intentions[0]?.evmTransaction?.nonce).toBe(42);
	});

	it("uses a provided from address for nonce lookup and address derivation", async () => {
		const mockArtifact = {
			abi: [{ type: "constructor", inputs: [] }],
			bytecode: "0x60006000",
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const config = await createConnectedConfig();
		const store = createStore();

		const customFrom = "0x00000000000000000000000000000000000000AA" as Address;

		await deployContract(
			mockHre,
			config,
			store,
			mockPublicClient,
			"FromContract",
			[],
			{ from: customFrom },
		);

		expect(mockGetTransactionCount).toHaveBeenCalledWith({
			address: customFrom,
		});

		const intention = store.getState().intentions[0];
		expect(intention.evmTransaction?.from).toBe(customFrom);

		const result = await deployContract(
			mockHre,
			config,
			store,
			mockPublicClient,
			"AnotherFromContract",
			[],
			{ from: customFrom },
		);

		expect(result.address).toBe(
			getContractAddress({ from: customFrom, nonce: 6n }),
		);
	});
});
