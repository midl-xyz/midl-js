import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__/wrapper";
import { useBroadcastTransaction } from "~/hooks/useBroadcastTransaction";

describe("useBroadcastTransaction", () => {
	it("returns the correct values", () => {
		const { result } = renderHook(() => useBroadcastTransaction(), { wrapper });

		expect("broadcastTransaction" in result.current).toBeTruthy();
		expect("broadcastTransactionAsync" in result.current).toBeTruthy();
		expect("isPending" in result.current).toBeTruthy();
	});
});
