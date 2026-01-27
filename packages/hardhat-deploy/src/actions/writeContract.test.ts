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
import { type Address, type PublicClient, encodeFunctionData } from "viem";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "~/actions/createStore";
import { getDeployment } from "~/actions/getDeployment";
import { writeContract } from "./writeContract";

vi.mock("~/actions/getDeployment", () => ({
	getDeployment: vi.fn(),
}));

const TEST_MNEMONIC =
	"test test test test test test test test test test test junk";

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

	const deploymentAddress =
		"0x00000000000000000000000000000000000000BB" as Address;

	beforeEach(() => {
		vi.clearAllMocks();
		mockGetTransactionCount.mockResolvedValue(7);
		vi.mocked(getDeployment).mockResolvedValue({
			address: deploymentAddress,
			abi: [],
		});
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

	it("throws error if contract is not deployed", async () => {
		vi.mocked(getDeployment).mockResolvedValue(null);

		const config = await createConnectedConfig();
		const store = createStore();

		await expect(
			writeContract(
				mockHre,
				config,
				store,
				mockPublicClient,
				"MissingContract",
				"transfer",
			),
		).rejects.toThrow("Contract MissingContract is not deployed");
	});

	it("encodes function call data and stores the intention", async () => {
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

		const config = await createConnectedConfig();
		const store = createStore();

		const args = [
			"0x1111111111111111111111111111111111111111" as Address,
			1000n,
		];

		await writeContract(
			mockHre,
			config,
			store,
			mockPublicClient,
			"Token",
			"transfer",
			args,
		);

		expect(store.getState().intentions).toHaveLength(1);

		const intention = store.getState().intentions[0];
		expect(intention.evmTransaction?.to).toBe(deploymentAddress);
		expect(intention.evmTransaction?.data).toBe(
			encodeFunctionData({
				abi: mockArtifact.abi,
				functionName: "transfer",
				args,
			}),
		);
		expect(intention.evmTransaction?.nonce).toBe(7);

		const expectedFrom = getEVMAddress(
			getDefaultAccount(config),
			config.getState().network,
		);
		expect(intention.evmTransaction?.from).toBe(expectedFrom);
	});

	it("increments nonce based on pending intentions", async () => {
		const mockArtifact = {
			abi: [
				{
					type: "function",
					name: "execute",
					inputs: [],
				},
			],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const config = await createConnectedConfig();
		const store = createStore();

		await writeContract(
			mockHre,
			config,
			store,
			mockPublicClient,
			"Executor",
			"execute",
		);
		await writeContract(
			mockHre,
			config,
			store,
			mockPublicClient,
			"Executor",
			"execute",
		);

		const nonces = store
			.getState()
			.intentions.map((it) => it.evmTransaction?.nonce);

		expect(nonces).toEqual([7, 8]);
	});

	it("respects evm overrides and intention options", async () => {
		const mockArtifact = {
			abi: [
				{
					type: "function",
					name: "mint",
					inputs: [],
				},
			],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const config = await createConnectedConfig();
		const store = createStore();

		await writeContract(
			mockHre,
			config,
			store,
			mockPublicClient,
			"NFT",
			"mint",
			[],
			{ value: 123n, gas: 50_000n, nonce: 99 },
			{ deposit: { satoshis: 200 } },
		);

		const intention = store.getState().intentions[0];
		expect(intention.evmTransaction?.nonce).toBe(99);
		expect(intention.evmTransaction?.value).toBe(123n);
		expect(intention.evmTransaction?.gas).toBe(50_000n);
		expect(intention.deposit).toEqual({ satoshis: 200 });
	});

	it("uses provided from address for nonce lookup", async () => {
		const mockArtifact = {
			abi: [
				{
					type: "function",
					name: "delegate",
					inputs: [],
				},
			],
		};
		mockReadArtifact.mockResolvedValue(mockArtifact);

		const config = await createConnectedConfig();
		const store = createStore();

		const customFrom = "0x00000000000000000000000000000000000000CC" as Address;

		await writeContract(
			mockHre,
			config,
			store,
			mockPublicClient,
			"Governance",
			"delegate",
			[],
			{ from: customFrom },
		);

		expect(mockGetTransactionCount).toHaveBeenCalledWith({
			address: customFrom,
		});
		expect(store.getState().intentions[0]?.evmTransaction?.from).toBe(
			customFrom,
		);
	});
});
