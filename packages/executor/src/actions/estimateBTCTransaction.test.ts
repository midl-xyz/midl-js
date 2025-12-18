import { AddressPurpose, connect, createConfig, disconnect } from "@midl/core";
import { keyPairConnector } from "@midl/node";
import { http, createWalletClient, zeroAddress } from "viem";
import * as viemActions from "viem/actions";
import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { __TEST__MNEMONIC__ } from "~/__tests__/keyPair";
import { midlConfig } from "~/__tests__/midlConfig";
import { estimateBTCTransaction } from "~/actions/estimateBTCTransaction";
import type { TransactionIntention } from "~/types";
import { getEVMFromBitcoinNetwork } from "~/utils";

vi.mock("viem/actions", async (importActual) => {
	const actual = await importActual<typeof import("viem/actions")>();

	return {
		...actual,
		readContract: vi.fn().mockImplementation(async (_, params) => {
			if (params.functionName === "currentValidators") {
				return zeroAddress;
			}

			throw new Error(`Unmocked readContract call: ${params.functionName}`);
		}),
		estimateGasMulti: vi.fn(),
	};
});

vi.mock("~/actions/getBTCFeeRate", async (importOriginal) => ({
	...(await importOriginal<typeof import("~/actions/getBTCFeeRate")>()),
	getBTCFeeRate: vi.fn().mockResolvedValue(2000n),
}));

describe("executor | actions | estimateTransaction", () => {
	const chain = getEVMFromBitcoinNetwork(midlConfig.getState().network);

	const walletClient = createWalletClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});

	beforeEach(async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});
	});

	afterEach(async () => {
		await disconnect(midlConfig);
		(viemActions.estimateGasMulti as Mock).mockReset();
	});

	it("throws if no network is provided", async () => {
		const config = createConfig({
			networks: [],
			connectors: [keyPairConnector({ mnemonic: __TEST__MNEMONIC__ })],
		});

		await expect(() =>
			estimateBTCTransaction(config, [], walletClient),
		).rejects.toThrow("No network set");
	});

	it("throws if no intentions are provided", async () => {
		await expect(() =>
			estimateBTCTransaction(midlConfig, [], walletClient),
		).rejects.toThrow("No intentions found");
	});

	it("throws if more than 10 intentions are provided", async () => {
		const intentions: TransactionIntention[] = new Array(11).fill({
			deposit: {
				satoshis: 1000,
			},
		});

		await expect(() =>
			estimateBTCTransaction(midlConfig, intentions, walletClient),
		).rejects.toThrow(
			"Cannot estimate BTC transaction with more than 10 intentions",
		);
	});

	it("throws if no account is found", async () => {
		const intentions: TransactionIntention[] = [
			{
				deposit: {
					satoshis: 1000,
				},
			},
		];
		await expect(() =>
			estimateBTCTransaction(midlConfig, intentions, walletClient, {
				from: "unknownAddress",
			}),
		).rejects.toThrow("No account found");
	});

	it("doesn't mutate original intentions", async () => {
		(viemActions.estimateGasMulti as Mock).mockResolvedValueOnce([0n, 21000n]);

		const originalIntentions: TransactionIntention[] = [
			{
				deposit: {
					satoshis: 1000,
				},
				evmTransaction: {
					to: "0x0000000000000000000000000000000000000001",
					value: 0n,
					chainId: chain.id,
				},
			},
		];

		const { intentions } = await estimateBTCTransaction(
			midlConfig,
			originalIntentions,
			walletClient,
		);

		expect(originalIntentions[0].evmTransaction?.gas).toBeUndefined();
		expect(intentions[0].evmTransaction?.gas).toBeDefined();
	});

	it("increases estimate gas by gas multiplier", async () => {
		(viemActions.estimateGasMulti as Mock).mockResolvedValueOnce([0n, 21000n]);

		const originalIntentions: TransactionIntention[] = [
			{
				deposit: {
					satoshis: 1000,
				},
				evmTransaction: {
					to: "0x0000000000000000000000000000000000000001",
					value: 0n,
					chainId: chain.id,
				},
			},
		];

		const gasMultiplier = 1.5;

		const { intentions } = await estimateBTCTransaction(
			midlConfig,
			originalIntentions,
			walletClient,
			{
				gasMultiplier,
			},
		);

		expect(intentions[0].evmTransaction?.gas).toBe(
			BigInt(Math.ceil(21000 * gasMultiplier)),
		);
	});

	it("uses provided gas limit if available", async () => {
		(viemActions.estimateGasMulti as Mock).mockResolvedValueOnce([0n, 21000n]);

		const originalIntentions: TransactionIntention[] = [
			{
				deposit: {
					satoshis: 1000,
				},
			},
			{
				deposit: {
					satoshis: 1000,
				},
				evmTransaction: {
					to: "0x0000000000000000000000000000000000000001",
					value: 0n,
					chainId: chain.id,
					gas: 30000n,
				},
			},
		];

		const { intentions } = await estimateBTCTransaction(
			midlConfig,
			originalIntentions,
			walletClient,
		);

		expect(viemActions.estimateGasMulti).toHaveBeenCalledTimes(0);
		expect(intentions[1].evmTransaction?.gas).toBe(30000n);
	});

	it("estimates gas only for transactions without gas limit", async () => {
		(viemActions.estimateGasMulti as Mock).mockResolvedValueOnce([
			0n,
			21000n,
			21000n,
		]);

		const originalIntentions: TransactionIntention[] = [
			{
				deposit: {
					satoshis: 1000,
				},
				evmTransaction: {
					to: "0x0000000000000000000000000000000000000001",
					value: 0n,
					chainId: chain.id,
					gas: 30000n,
				},
			},
			{
				evmTransaction: {
					to: "0x0000000000000000000000000000000000000001",
					value: 0n,
					chainId: chain.id,
				},
			},
		];

		const { intentions } = await estimateBTCTransaction(
			midlConfig,
			originalIntentions,
			walletClient,
		);

		expect(viemActions.estimateGasMulti).toHaveBeenCalledTimes(1);
		expect(intentions[0].evmTransaction?.gas).toBe(30000n);
		expect(intentions[1].evmTransaction?.gas).toBeDefined();
	});

	it("doesn't ensure gas with min fees", async () => {
		(viemActions.estimateGasMulti as Mock).mockResolvedValueOnce([0n, 21000n]);

		const originalIntentions: TransactionIntention[] = [
			{
				deposit: {
					satoshis: 1000,
				},
				evmTransaction: {
					to: "0x0000000000000000000000000000000000000001",
					value: 0n,
					chainId: chain.id,
					gas: 30000n,
				},
			},
		];

		await estimateBTCTransaction(midlConfig, originalIntentions, walletClient, {
			stateOverride: [
				{
					address: "0x0000000000000000000000000000000000000001",
					balance: 10000n,
				},
			],
		});

		expect(viemActions.estimateGasMulti).not.toHaveBeenCalled();
	});

	it("throws if estimateGas fails", async () => {
		(viemActions.estimateGasMulti as Mock).mockRejectedValueOnce(
			new Error("Failed to estimate gas"),
		);

		const originalIntentions: TransactionIntention[] = [
			{
				deposit: {
					satoshis: 1000,
				},
				evmTransaction: {
					to: "0x0000000000000000000000000000000000000001",
					value: 0n,
					chainId: chain.id,
				},
			},
		];

		await expect(() =>
			estimateBTCTransaction(midlConfig, originalIntentions, walletClient),
		).rejects.toThrow("Failed to estimate gas");
	});

	it("skips estimating gas when option is set", async () => {
		const originalIntentions: TransactionIntention[] = [
			{
				deposit: {
					satoshis: 1000,
				},
				evmTransaction: {
					to: "0x0000000000000000000000000000000000000001",
					value: 0n,
					chainId: chain.id,
				},
			},
		];

		const { intentions } = await estimateBTCTransaction(
			midlConfig,
			originalIntentions,
			walletClient,
			{
				skipEstimateGas: true,
			},
		);

		expect(viemActions.estimateGasMulti).not.toHaveBeenCalled();
		expect(intentions[0].evmTransaction?.gas).toBeUndefined();
	});

	it("returns correct fee estimation", async () => {
		(viemActions.estimateGasMulti as Mock).mockResolvedValueOnce([0n, 21000n]);

		const originalIntentions: TransactionIntention[] = [
			{
				deposit: {
					satoshis: 1000,
				},
				evmTransaction: {
					to: "0x0000000000000000000000000000000000000001",
					value: 0n,
					chainId: chain.id,
				},
			},
		];

		const { fee } = await estimateBTCTransaction(
			midlConfig,
			originalIntentions,
			walletClient,
			{
				feeRate: 2.59,
			},
		);

		expect(fee).toBe(1125);
	});
});
