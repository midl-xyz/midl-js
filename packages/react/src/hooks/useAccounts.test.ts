import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__/wrapper";
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
});
