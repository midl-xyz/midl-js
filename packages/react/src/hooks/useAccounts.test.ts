import { AddressPurpose } from "@midl-xyz/midl-js-core";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { config, wrapper } from "~/__tests__/wrapper";
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

	it.skip("should set correctly isConnected", async () => {
		const { result, rerender } = renderHook(() => useAccounts(), { wrapper });

		await config.connectors[0].connect({
			purposes: [AddressPurpose.Ordinals],
		});

		act(() => {
			rerender();
		});

		expect(result.current.isConnected).toBe(true);
	});
});
