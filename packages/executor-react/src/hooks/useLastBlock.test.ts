import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__";
import { useLastBlock } from "~/hooks/useLastBlock";

describe("useLastBlock", () => {
	it.skip("should return the correct value", async () => {
		const { result } = renderHook(() => useLastBlock(), {
			wrapper,
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		console.log(result.current.lastBlock);

		expect(result.current.lastBlock).toBeGreaterThan(0n);
	});
});
