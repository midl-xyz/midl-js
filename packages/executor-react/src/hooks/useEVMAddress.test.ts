import { renderHook, waitFor } from "@testing-library/react";
import { zeroAddress } from "viem";
import { describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__";
import { useEVMAddress } from "~/hooks/useEVMAddress";

describe("useEVMAddress", () => {
	it("should return the correct value", async () => {
		const { result, unmount, rerender } = renderHook(() => useEVMAddress(), {
			wrapper,
		});

		await waitFor(() => {
			return expect(result.current).not.toBe(zeroAddress);
		});

		rerender();

		expect(result.current).toBe("0x8Ccf062691b33747c2C0950621992BCDe33A8d5C");
	});
});
