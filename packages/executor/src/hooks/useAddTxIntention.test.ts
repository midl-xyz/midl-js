import { renderHook, waitFor } from "@testing-library/react";
import { zeroAddress } from "viem";
import { describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__";
import { useAddTxIntention } from "~/hooks/useAddTxIntention";

describe("useAddTxIntention", () => {
	it("should add intention to the store", async () => {
		const { result } = renderHook(() => useAddTxIntention(), {
			wrapper,
		});

		const { addTxIntention } = result.current;

		addTxIntention({
			evmTransaction: {
				to: zeroAddress,
				value: 1n,
				chainId: 1,
			},
		});

		await waitFor(() => expect(result.current.txIntentions.length).toBe(1));

		expect(result.current.txIntentions?.[0]).toEqual({
			evmTransaction: {
				to: zeroAddress,
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
			evmTransaction: {
				to: zeroAddress,
				value: 1n,
				chainId: 1,
			},
		});

		addTxIntention({
			evmTransaction: {
				to: zeroAddress,
				value: 1n,
				chainId: 1,
			},
		});

		rerender();

		expect(result.current.txIntentions?.length).toBe(2);
	});

	it("should reset previous intentions", async () => {
		const { result, rerender } = renderHook(() => useAddTxIntention(), {
			wrapper,
		});

		const { addTxIntention } = result.current;

		addTxIntention({
			evmTransaction: {
				to: zeroAddress,
				value: 1n,
				chainId: 1,
			},
		});

		addTxIntention({
			evmTransaction: {
				to: zeroAddress,
				value: 1n,
				chainId: 1,
			},
			reset: true,
		});

		rerender();

		expect(result.current.txIntentions?.length).toBe(1);
	});

	it("should throw if intentions queue is longer than 10 transactions", async () => {
		const { result, rerender } = renderHook(() => useAddTxIntention(), {
			wrapper,
		});

		const { addTxIntention } = result.current;

		for (let i = 0; i < 10; i++) {
			addTxIntention({
				evmTransaction: {
					to: zeroAddress,
					value: 1n,
					chainId: 1,
				},
			});
		}

		expect(() =>
			addTxIntention({
				evmTransaction: {
					to: zeroAddress,
					value: 1n,
					chainId: 1,
				},
			}),
		).toThrow("Maximum number of intentions reached");
	});
});
