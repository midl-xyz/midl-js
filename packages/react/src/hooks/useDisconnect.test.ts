import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__/wrapper";
import { useDisconnect } from "~/hooks/useDisconnect";

describe("useDisconnect", () => {
	it("returns the correct values", () => {
		const { result } = renderHook(() => useDisconnect(), {
			wrapper,
		});

		expect("disconnect" in result.current).toBeTruthy();
		expect("disconnectAsync" in result.current).toBeTruthy();
	});
});
