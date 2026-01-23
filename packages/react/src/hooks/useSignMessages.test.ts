import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__/wrapper";
import { useSignMessages } from "~/hooks/useSignMessages";

describe("useSignMessages", () => {
	it("returns the correct values", () => {
		const { result } = renderHook(() => useSignMessages(), { wrapper });

		expect("signMessages" in result.current).toBeTruthy();
		expect("signMessagesAsync" in result.current).toBeTruthy();
		expect("isPending" in result.current).toBeTruthy();
	});
});
