import { AddressPurpose, connect, disconnect } from "@midl/core";
import type { TransactionIntention } from "@midl/executor";
import { createStore } from "@midl/react";
import { renderHook } from "@testing-library/react";
import { zeroAddress } from "viem";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { wrapper } from "~/__tests__";
import { midlConfig } from "~/__tests__/midlConfig";
import { useSignIntention } from "~/hooks/useSignIntention";

describe("executor-react | hooks | useSignIntention", () => {
	beforeEach(async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});
	});

	afterEach(async () => {
		await disconnect(midlConfig);
	});

	it("signs and modifies store with signed evm transaction", async () => {
		const intention: TransactionIntention = {
			evmTransaction: {
				to: zeroAddress,
				value: 0n,
				chainId: 777,
			},
		};

		const store = createStore({
			intentions: [intention],
		});
		const { result } = renderHook(
			() =>
				useSignIntention({
					store,
				}),
			{
				wrapper,
			},
		);

		await result.current.signIntentionAsync({
			intention: intention,
			txId: "1d83542e985d6a18baf09d75e0bb35de21f0390d7323848fae5890944374735e",
		});

		const [modifiedIntention] = store.getState()
			.intentions as TransactionIntention[];

		expect(modifiedIntention.signedEvmTransaction).toBeDefined();
	});
});
