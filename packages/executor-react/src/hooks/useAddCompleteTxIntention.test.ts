import { AddressPurpose, connect, disconnect } from "@midl/core";
import { SystemContracts, type TransactionIntention } from "@midl/executor";
import { createStore } from "@midl/react";
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__";
import { midlConfig } from "~/__tests__/midlConfig";
import { useAddCompleteTxIntention } from "~/hooks/useAddCompleteTxIntention";

describe("executor-react | hooks | useAddCompleteTxIntention", () => {
	beforeEach(async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});
	});

	afterEach(async () => {
		await disconnect(midlConfig);
	});

	it("creates complete tx intention", async () => {
		const store = createStore({ intentions: [] });
		const { result } = renderHook(
			() =>
				useAddCompleteTxIntention({
					store,
				}),
			{
				wrapper,
			},
		);

		await result.current.addCompleteTxIntentionAsync();

		const [intention] = store.getState().intentions as TransactionIntention[];

		expect(intention.evmTransaction?.to).toBe(SystemContracts.Executor);
	});
});
