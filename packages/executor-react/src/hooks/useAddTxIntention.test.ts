import { AddressPurpose, connect } from "@midl-xyz/midl-js-core";
import { renderHook, waitFor } from "@testing-library/react";
import { zeroAddress } from "viem";
import { beforeEach, describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__";
import { midlConfig } from "~/__tests__/midlConfig";
import { useAddTxIntention } from "~/hooks/useAddTxIntention";

describe("useAddTxIntention", () => {
	beforeEach(() => {
		connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});
	});

	it("should add intention to the store", async () => {
		const { result } = renderHook(() => useAddTxIntention(), {
			wrapper,
		});

		const { addTxIntention } = result.current;

		addTxIntention({
			intention: {
				evmTransaction: {
					to: zeroAddress,
					value: 1n,
					chainId: 1,
				},
			},
		});

		await waitFor(() => expect(result.current.txIntentions.length).toBe(1));

		expect(result.current.txIntentions?.[0]).toEqual({
			evmTransaction: {
				to: zeroAddress,
				from: "0x8Ccf062691b33747c2C0950621992BCDe33A8d5C",
				value: 1n,
				chainId: 1,
			},
		});
	});

	it("should add intentions to the existing ones", async () => {
		const { result, rerender } = renderHook(() => useAddTxIntention(), {
			wrapper,
		});

		const { addTxIntention } = result.current;

		addTxIntention({
			intention: {
				evmTransaction: {
					to: zeroAddress,
					value: 1n,
					chainId: 1,
				},
			},
		});

		addTxIntention({
			intention: {
				evmTransaction: {
					to: zeroAddress,
					value: 1n,
					chainId: 1,
				},
			},
		});

		await waitFor(() => expect(result.current.txIntentions.length).toBe(2));
	});

	it("should reset previous intentions", async () => {
		const { result, rerender } = renderHook(() => useAddTxIntention(), {
			wrapper,
		});

		const { addTxIntention } = result.current;

		addTxIntention({
			intention: {
				evmTransaction: {
					to: zeroAddress,
					value: 1n,
					chainId: 1,
				},
			},
		});

		addTxIntention({
			intention: {
				evmTransaction: {
					to: zeroAddress,
					value: 1n,
					chainId: 1,
				},
			},
			reset: true,
		});

		rerender();

		await waitFor(() => expect(result.current.txIntentions.length).toBe(1));
	});
});
