import { AddressPurpose, connect } from "@midl/core";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { midlConfig, wrapper } from "~/__tests__/wrapper";
import { useBalance } from "~/hooks/useBalance";

vi.mock("@midl/core", async (importOriginal) => {
	return {
		...(await importOriginal<typeof import("@midl/core")>()),
		getBalance: vi.fn().mockResolvedValue(123456n),
	};
});

describe("useBalance", () => {
	beforeEach(async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Payment],
		});
	});

	it("works", async () => {
		const { result } = renderHook(() => useBalance(), {
			wrapper,
		});

		await waitFor(() => expect(result.current.isFetching).toBe(false));

		expect(result.current.isError).toBe(false);
		expect(result.current.balance).toBeGreaterThanOrEqual(123456n);
	});
});
