import { AddressPurpose, connect, disconnect } from "@midl/core";
import { type TransactionIntention, midlRegtest } from "@midl/executor";
import { createStore } from "@midl/react";
import { act, renderHook } from "@testing-library/react";
import { zeroAddress } from "viem";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__";
import { midlConfig } from "~/__tests__/midlConfig";
import { useSignIntentions } from "~/hooks/useSignIntentions";

describe("executor-react | hooks | useSignIntentions", () => {
	beforeEach(async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});
	});

	afterEach(async () => {
		await disconnect(midlConfig);
	});

	it("signs and modifies store with signed evm transactions", async () => {
		const intentions: TransactionIntention[] = [
			{
				evmTransaction: {
					to: zeroAddress,
					value: 0n,
					chainId: midlRegtest.id,
				},
			},
			{
				evmTransaction: {
					to: zeroAddress,
					value: 0n,
					chainId: midlRegtest.id,
				},
			},
		];

		const store = createStore({
			intentions,
		});

		const { result } = renderHook(
			() =>
				useSignIntentions({
					store,
				}),
			{ wrapper },
		);

		await result.current.signIntentionsAsync({
			txId: "1d83542e985d6a18baf09d75e0bb35de21f0390d7323848fae5890944374735e",
		});

		const modifiedIntentions = store.getState()
			.intentions as TransactionIntention[];

		for (const intention of modifiedIntentions) {
			expect(intention.signedEvmTransaction).toBeDefined();
		}
	});
});
