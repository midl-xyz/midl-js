import { AddressPurpose, connect, disconnect } from "@midl-xyz/midl-js-core";
import {
	type TransactionIntention,
	executorAddress,
} from "@midl-xyz/midl-js-executor";
import { createStore } from "@midl-xyz/midl-js-react";
import { renderHook } from "@testing-library/react";
import { zeroAddress } from "viem";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__";
import { midlConfig } from "~/__tests__/midlConfig";
import { useAddCompleteTxIntention } from "~/hooks/useAddCompleteTxIntention";

describe("executor-react | hooks | useAddCompleteTxIntention", () => {
	beforeEach(async () => {
		await connect(midlConfig, { purposes: [AddressPurpose.Ordinals] });
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

		await result.current.addCompleteTxIntentionAsync({
			assetsToWithdraw: [zeroAddress],
		});

		const [intention] = store.getState().intentions as TransactionIntention[];

		expect(intention.evmTransaction.to).toBe(
			executorAddress[midlConfig.getState().network.id],
		);
	});
});
