import { AddressPurpose, connect, disconnect } from "@midl/core";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { midlConfig, wrapper } from "~/__tests__/wrapper";
import { useAccounts } from "~/hooks/useAccounts";

describe("useAccounts", () => {
	it("returns the correct values", () => {
		const { result } = renderHook(() => useAccounts(), {
			wrapper,
		});

		expect("accounts" in result.current).toBeTruthy();
		expect("connector" in result.current).toBeTruthy();
		expect("isConnecting" in result.current).toBeTruthy();
		expect("isConnected" in result.current).toBeTruthy();
		expect("network" in result.current).toBeTruthy();
		expect("status" in result.current).toBeTruthy();
	});

	it("should show connected", async () => {
		const { result } = renderHook(() => useAccounts(), {
			wrapper,
		});

		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});

		waitFor(() => {
			expect(result.current.isConnected).toBe(true);
		});
	});

	it("should show disconnected", async () => {
		const { result } = renderHook(() => useAccounts(), {
			wrapper,
		});

		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});

		await disconnect(midlConfig);

		expect(result.current.isConnected).toBe(false);
	});

	it("should set correctly isConnected", async () => {
		const { result, rerender } = renderHook(() => useAccounts(), { wrapper });

		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});

		act(() => {
			rerender();
		});

		expect(result.current.isConnected).toBe(true);
	});
});
