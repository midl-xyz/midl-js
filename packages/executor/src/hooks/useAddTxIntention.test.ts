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
			tx: {
				to: zeroAddress,
				value: 1n,
			},
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(result.current.txIntentions?.[0]).toEqual({
			to: zeroAddress,
			value: 1n,
		});
	});

	it("should add intentions to the existing ones", async () => {
		const { result } = renderHook(() => useAddTxIntention(), {
			wrapper,
		});

		const { addTxIntentionAsync, addTxIntention } = result.current;

		await addTxIntentionAsync({
			tx: {
				to: zeroAddress,
				value: 1n,
			},
		});

		await addTxIntentionAsync({
			tx: {
				to: zeroAddress,
				value: 2n,
			},
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(result.current.txIntentions?.length).toBe(2);
	});

	it("should reset previous intentions", async () => {
		const { result } = renderHook(() => useAddTxIntention(), {
			wrapper,
		});

		const { addTxIntentionAsync } = result.current;

		await addTxIntentionAsync({
			tx: {
				to: zeroAddress,
				value: 1n,
			},
		});

		await addTxIntentionAsync({
			tx: {
				to: zeroAddress,
				value: 1n,
			},
			reset: true,
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(result.current.txIntentions?.length).toBe(1);
	});

	it("should throw if intentions queue is longer than 10 transactions", async () => {
		const { result, rerender } = renderHook(() => useAddTxIntention(), {
			wrapper,
		});

		const { addTxIntentionAsync } = result.current;

		for (let i = 0; i < 10; i++) {
			await addTxIntentionAsync({
				tx: {
					to: zeroAddress,
					value: 1n,
				},
			});
		}

		rerender();

		expect(result.current.error).toBeNull();

		expect(
			addTxIntentionAsync({
				tx: {
					to: zeroAddress,
					value: 1n,
				},
			}),
		).rejects.toThrow("Maximum number of intentions reached");
	});
});
