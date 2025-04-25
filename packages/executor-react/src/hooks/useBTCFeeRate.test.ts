import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__";
import { useBTCFeeRate } from "~/hooks/useBTCFeeRate";

describe("useBTCFeeRate", () => {
	it.skip("should return the correct value", async () => {
		const { result, rerender } = renderHook(() => useBTCFeeRate(), {
			wrapper,
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		rerender();

		expect(result.current.data).toBeGreaterThan(1n);
	});
});
