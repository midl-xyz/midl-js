import { AddressPurpose, connect, disconnect } from "@midl/core";
import { http, type Chain, createWalletClient } from "viem";
import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { finalizeBTCTransaction } from "~/actions/finalizeBTCTransaction";
import type { TransactionIntention } from "~/types";
import { getEVMFromBitcoinNetwork } from "~/utils";
import * as estimateActions from "./estimateBTCTransaction";

vi.mock("./estimateBTCTransaction", async (importActual) => {
	const actual =
		await importActual<typeof import("./estimateBTCTransaction")>();
	return {
		...actual,
		estimateBTCTransaction: vi.fn(),
	};
});

vi.mock("./getTSSAddress", async (importActual) => {
	const actual = await importActual<typeof import("./getTSSAddress")>();
	return {
		...actual,
		getTSSAddress: vi
			.fn()
			.mockResolvedValue(
				"bcrt1prdz97t7n4fqvrqzh3f3syknpjutcz8y23fmn47klhaaq95nl24fq57u8tq",
			),
	};
});

describe("finalizeBTCTransaction", () => {
	const chain = getEVMFromBitcoinNetwork(midlConfig.getState().network);

	const walletClient = createWalletClient({
		chain: chain as Chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});

	beforeEach(async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Payment],
		});
	});

	afterEach(async () => {
		await disconnect(midlConfig);
		(estimateActions.estimateBTCTransaction as Mock).mockReset();
	});

	it("throws no intentions", async () => {
		await expect(
			finalizeBTCTransaction(midlConfig, [], walletClient),
		).rejects.toThrowError(
			"Cannot finalize BTC transaction without intentions",
		);
	});

	it("mutates original intentions", async () => {
		(estimateActions.estimateBTCTransaction as Mock).mockResolvedValue({
			intentions: [
				{
					deposit: {
						satoshis: 1000,
					},
					evmTransaction: {
						to: "0x0000000000000000000000000000000000000001",
						value: 0n,
						chainId: chain.id,
						gas: 21000n,
					},
				},
			],
			fee: 1000n,
		});

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

		await finalizeBTCTransaction(midlConfig, originalIntentions, walletClient, {
			feeRate: 1,
		});
		expect(estimateActions.estimateBTCTransaction).toHaveBeenCalled();

		expect(originalIntentions[0].evmTransaction?.gas).toBe(21000n);
	});
});
