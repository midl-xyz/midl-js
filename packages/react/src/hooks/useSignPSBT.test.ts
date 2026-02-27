import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__/wrapper";
import { useSignPSBT } from "~/hooks/useSignPSBT";

describe("useSignPSBT", () => {
	it("returns the correct values", () => {
		const { result } = renderHook(() => useSignPSBT(), { wrapper });

		expect("signPSBT" in result.current).toBeTruthy();
		expect("signPSBTAsync" in result.current).toBeTruthy();
		expect("isPending" in result.current).toBeTruthy();
	});
});
