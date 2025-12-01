import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { wrapper } from "~/__tests__";
import { useBTCFeeRate } from "~/hooks/useBTCFeeRate";

vi.mock("@midl/executor", async (importOriginal) => {
	return {
		...(await importOriginal<typeof import("@midl/executor")>()),
		getBTCFeeRate: vi.fn().mockResolvedValue(2n),
	};
});

describe("useBTCFeeRate", () => {
	it("should return the correct value", async () => {
		const { result, rerender } = renderHook(() => useBTCFeeRate(), {
			wrapper,
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		rerender();

		expect(result.current.data).toBe(2n);
	});
});
