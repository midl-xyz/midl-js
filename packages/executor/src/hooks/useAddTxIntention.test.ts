import { AddressPurpose } from "@midl-xyz/midl-js-core";
import { renderHook, waitFor } from "@testing-library/react";
import { zeroAddress } from "viem";
import { beforeAll, describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__";
import { midlConfig } from "~/__tests__/midlConfig";
import { useAddTxIntention } from "~/hooks/useAddTxIntention";

describe("useAddTxIntention", () => {
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
				from: "0xBF8fb6Ca403EA249838FFc8d230b20cf5cb38851",
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

	it("should throw if intentions queue is longer than 10 transactions", async () => {
		const { result } = renderHook(() => useAddTxIntention(), {
			wrapper,
		});

		const { addTxIntention } = result.current;

		for (let i = 0; i < 10; i++) {
			addTxIntention({
				intention: {
					evmTransaction: {
						to: zeroAddress,
						value: 1n,
						chainId: 1,
					},
				},
			});
		}

		addTxIntention({
			intention: {
				evmTransaction: {
					to: zeroAddress,
					value: 1n,
					chainId: 1,
				},
			},
		});

		await waitFor(() => expect(result.current.isError).toBe(true));

		expect(result.current.error?.message).toBe(
			"Maximum number of intentions reached",
		);
	});
});
