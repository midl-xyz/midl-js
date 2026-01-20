import { type Config, getDefaultAccount } from "@midl/core";
import { getEVMAddress } from "@midl/executor";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { http, type PublicClient, createPublicClient } from "viem";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	EmptyIntentionsError,
	createStore,
	deleteDeployment,
	deployContract,
	execute,
	getBitcoinNetwork,
	getChain,
	getDeployment,
	readContract,
	saveDeployment,
	setup,
	writeContract,
} from "~/actions";
import type { MidlNetworkConfig } from "~/type-extensions";
import { createMidlHardhatEnvironment } from "./createMidlHardhatEnvironment";

vi.mock("@midl/core");
vi.mock("@midl/executor");
vi.mock("viem");
vi.mock("~/actions");

describe("createMidlHardhatEnvironment", () => {
	const mockChain = {
		rpcUrls: {
			default: {
				http: ["http://localhost:8545"],
			},
		},
	};

	const mockUserConfig: MidlNetworkConfig = {
		confirmationsRequired: 1,
		btcConfirmationsRequired: 1,
	} as MidlNetworkConfig;

	const mockHre = {
		userConfig: {
			midl: {
				networks: {
					default: mockUserConfig,
				},
			},
		},
		hardhatArguments: {
			network: "default",
		},
	} as unknown as HardhatRuntimeEnvironment;

	const mockPublicClient = {} as PublicClient;
	const mockConfig = {
		getState: vi.fn(() => ({
			network: "regtest",
		})),
	} as unknown as Config;

	const mockStore = {
		getState: vi.fn(() => ({ intentions: [] })),
		setState: vi.fn(),
		subscribe: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(createStore).mockReturnValue(
			mockStore as unknown as ReturnType<typeof createStore>,
		);
		vi.mocked(getChain).mockReturnValue(
			mockChain as ReturnType<typeof getChain>,
		);
		vi.mocked(getBitcoinNetwork).mockReturnValue(
			"regtest" as unknown as ReturnType<typeof getBitcoinNetwork>,
		);
		vi.mocked(createPublicClient).mockReturnValue(mockPublicClient);
		vi.mocked(http).mockReturnValue({} as ReturnType<typeof http>);
		vi.mocked(setup).mockResolvedValue(mockConfig);
		vi.mocked(getDefaultAccount).mockReturnValue({
			address: "tb1qtest",
			publicKey: "0x123",
		} as ReturnType<typeof getDefaultAccount>);
		vi.mocked(getEVMAddress).mockReturnValue(
			"0x1234567890abcdef" as ReturnType<typeof getEVMAddress>,
		);
	});

	it("creates a store on initialization", () => {
		createMidlHardhatEnvironment(mockHre);

		expect(createStore).toHaveBeenCalled();
	});

	it("gets chain configuration from user config", () => {
		createMidlHardhatEnvironment(mockHre);

		expect(getChain).toHaveBeenCalledWith(mockUserConfig, mockHre);
	});

	it("gets bitcoin network from user config", () => {
		createMidlHardhatEnvironment(mockHre);

		expect(getBitcoinNetwork).toHaveBeenCalledWith(mockUserConfig);
	});

	it("creates public client with correct chain and transport", () => {
		createMidlHardhatEnvironment(mockHre);

		expect(http).toHaveBeenCalledWith("http://localhost:8545");
		expect(createPublicClient).toHaveBeenCalledWith({
			chain: mockChain,
			transport: {},
		});
	});

	it("throws error when calling deploy before initialize", async () => {
		const env = createMidlHardhatEnvironment(mockHre);

		await expect(() => env.deploy("MyContract")).rejects.toThrow(
			"Midl not initialized. Call initialize() first.",
		);
	});

	it("throws error when calling execute before initialize", async () => {
		const env = createMidlHardhatEnvironment(mockHre);

		await expect(env.execute({})).rejects.toThrow(
			"Midl not initialized. Call initialize() first.",
		);
	});

	it("throws error when calling read before initialize", async () => {
		const env = createMidlHardhatEnvironment(mockHre);

		await expect(env.read("Token", "balanceOf")).rejects.toThrow(
			"Midl not initialized. Call initialize() first.",
		);
	});

	it("throws error when calling write before initialize", async () => {
		const env = createMidlHardhatEnvironment(mockHre);

		await expect(env.write("Token", "transfer")).rejects.toThrow(
			"Midl not initialized. Call initialize() first.",
		);
	});

	it("throws error when accessing account before initialize", () => {
		const env = createMidlHardhatEnvironment(mockHre);

		expect(() => env.account).toThrow(
			"Midl not initialized. Call initialize() first.",
		);
	});

	it("throws error when accessing evm.address before initialize", () => {
		const env = createMidlHardhatEnvironment(mockHre);

		expect(() => env.evm.address).toThrow(
			"Midl not initialized. Call initialize() first.",
		);
	});

	it("calls setup with correct parameters on initialize", async () => {
		const env = createMidlHardhatEnvironment(mockHre);

		await env.initialize(5);

		expect(setup).toHaveBeenCalledWith(mockUserConfig, mockStore, {
			bitcoinNetwork: "regtest",
			accountIndex: 5,
		});
	});

	it("defaults to accountIndex 0 if not provided", async () => {
		const env = createMidlHardhatEnvironment(mockHre);

		await env.initialize();

		expect(setup).toHaveBeenCalledWith(mockUserConfig, mockStore, {
			bitcoinNetwork: "regtest",
			accountIndex: 0,
		});
	});

	it("returns config from initialize", async () => {
		const env = createMidlHardhatEnvironment(mockHre);

		const result = await env.initialize();

		expect(result).toBe(mockConfig);
	});

	it("calls deployContract with correct parameters", async () => {
		const env = createMidlHardhatEnvironment(mockHre);
		await env.initialize();

		const args = [100, "test"];
		const options = { libraries: {} };

		await env.deploy("MyContract", args, options);

		expect(deployContract).toHaveBeenCalledWith(
			mockHre,
			mockConfig,
			mockStore,
			mockPublicClient,
			"MyContract",
			args,
			options,
		);
	});

	it("calls execute with correct parameters", async () => {
		const env = createMidlHardhatEnvironment(mockHre);
		await env.initialize();

		const options = { withdraw: true };

		await env.execute(options);

		expect(execute).toHaveBeenCalledWith(
			mockUserConfig,
			mockHre,
			mockConfig,
			mockStore,
			mockPublicClient,
			options,
		);
	});

	it("calls readContract with correct parameters", async () => {
		const env = createMidlHardhatEnvironment(mockHre);
		await env.initialize();

		const args = ["0x1234"];
		const options = { overrides: { blockNumber: 123n } };

		await env.read("Token", "balanceOf", args, options);

		expect(readContract).toHaveBeenCalledWith(
			mockHre,
			mockPublicClient,
			"Token",
			"balanceOf",
			args,
			options,
		);
	});

	it("calls writeContract with correct parameters", async () => {
		const env = createMidlHardhatEnvironment(mockHre);
		await env.initialize();

		const args = ["0x1234", 100];
		const options = { overrides: {} };

		await env.write("Token", "transfer", args, options);

		expect(writeContract).toHaveBeenCalledWith(
			mockHre,
			mockConfig,
			mockStore,
			mockPublicClient,
			"Token",
			"transfer",
			args,
			options,
		);
	});

	it("calls saveDeployment for save method", async () => {
		const env = createMidlHardhatEnvironment(mockHre);

		const data = { address: "0xabc" as `0x${string}`, abi: [] };
		await env.save("MyContract", data);

		expect(saveDeployment).toHaveBeenCalledWith(mockHre, "MyContract", data);
	});

	it("calls deleteDeployment for delete method", async () => {
		const env = createMidlHardhatEnvironment(mockHre);

		await env.delete("MyContract");

		expect(deleteDeployment).toHaveBeenCalledWith(mockHre, "MyContract");
	});

	it("calls getDeployment for get method", async () => {
		const env = createMidlHardhatEnvironment(mockHre);

		await env.get("MyContract");

		expect(getDeployment).toHaveBeenCalledWith(mockHre, "MyContract");
	});

	it("returns account after initialize", async () => {
		const env = createMidlHardhatEnvironment(mockHre);
		await env.initialize();

		const account = env.account;

		expect(getDefaultAccount).toHaveBeenCalledWith(mockConfig);
		expect(account).toEqual({
			address: "tb1qtest",
			publicKey: "0x123",
		});
	});

	it("returns evm address after initialize", async () => {
		const env = createMidlHardhatEnvironment(mockHre);
		await env.initialize();

		const address = env.evm.address;

		expect(getDefaultAccount).toHaveBeenCalledWith(mockConfig);
		expect(getEVMAddress).toHaveBeenCalledWith(
			{
				address: "tb1qtest",
				publicKey: "0x123",
			},
			"regtest",
		);
		expect(address).toBe("0x1234567890abcdef");
	});

	it("allows multiple method calls after single initialize", async () => {
		const env = createMidlHardhatEnvironment(mockHre);
		await env.initialize();

		await env.deploy("Contract1");
		await env.deploy("Contract2");
		await env.write("Contract1", "method1");

		expect(deployContract).toHaveBeenCalledTimes(2);
		expect(writeContract).toHaveBeenCalledTimes(1);
	});

	it("updates address when initialize is called with different accountIndex", async () => {
		const env = createMidlHardhatEnvironment(mockHre);

		// First initialization with default accountIndex
		await env.initialize();
		const firstAddress = env.evm.address;
		expect(firstAddress).toBe("0x1234567890abcdef");
		expect(getDefaultAccount).toHaveBeenCalledTimes(1);
		expect(getEVMAddress).toHaveBeenCalledTimes(1);

		// Setup different mock values for second initialization
		vi.mocked(getDefaultAccount).mockReturnValue({
			address: "tb1qtest2",
			publicKey: "0x456",
		} as ReturnType<typeof getDefaultAccount>);
		vi.mocked(getEVMAddress).mockReturnValue(
			"0xabcdef1234567890" as ReturnType<typeof getEVMAddress>,
		);

		// Second initialization with different accountIndex
		await env.initialize(1);
		const secondAddress = env.evm.address;
		expect(secondAddress).toBe("0xabcdef1234567890");
		expect(getDefaultAccount).toHaveBeenCalledTimes(2);
		expect(getEVMAddress).toHaveBeenCalledTimes(2);
		expect(secondAddress).not.toBe(firstAddress);
	});

	it("uses network from hardhatArguments", () => {
		const customHre = {
			...mockHre,
			userConfig: {
				midl: {
					networks: {
						testnet: { ...mockUserConfig },
					},
				},
			},
			hardhatArguments: {
				network: "testnet",
			},
		} as unknown as HardhatRuntimeEnvironment;

		createMidlHardhatEnvironment(customHre);

		expect(getChain).toHaveBeenCalledWith(mockUserConfig, customHre);
	});

	it("can call save, delete, and get without initialize", async () => {
		const env = createMidlHardhatEnvironment(mockHre);

		// These should not throw
		await env.save("Contract", { address: "0x123" as `0x${string}`, abi: [] });
		await env.delete("Contract");
		await env.get("Contract");

		expect(saveDeployment).toHaveBeenCalled();
		expect(deleteDeployment).toHaveBeenCalled();
		expect(getDeployment).toHaveBeenCalled();
	});

	it("handles deploy with no args or options", async () => {
		const env = createMidlHardhatEnvironment(mockHre);
		await env.initialize();

		await env.deploy("SimpleContract");

		expect(deployContract).toHaveBeenCalledWith(
			mockHre,
			mockConfig,
			mockStore,
			mockPublicClient,
			"SimpleContract",
			undefined,
			undefined,
		);
	});

	it("handles read with no args or options", async () => {
		const env = createMidlHardhatEnvironment(mockHre);
		await env.initialize();

		await env.read("Token", "totalSupply");

		expect(readContract).toHaveBeenCalledWith(
			mockHre,
			mockPublicClient,
			"Token",
			"totalSupply",
			undefined,
			undefined,
		);
	});

	it("handles write with no args or options", async () => {
		const env = createMidlHardhatEnvironment(mockHre);
		await env.initialize();

		await env.write("Token", "pause");

		expect(writeContract).toHaveBeenCalledWith(
			mockHre,
			mockConfig,
			mockStore,
			mockPublicClient,
			"Token",
			"pause",
			undefined,
			undefined,
		);
	});

	it("doesn't throw if no intentions to execute", async () => {
		const env = createMidlHardhatEnvironment(mockHre);
		await env.initialize();

		vi.mocked(execute).mockRejectedValueOnce(new EmptyIntentionsError());

		await expect(env.execute()).resolves.toBeNull();
	});
});
