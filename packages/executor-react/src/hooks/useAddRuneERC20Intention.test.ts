import { addRuneERC20Intention } from "@midl/executor";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { wrapper } from "~/__tests__";
import { useAddRuneERC20Intention } from "~/hooks/useAddRuneERC20Intention";

describe("executor | hooks | useAddRuneERC20", () => {
	beforeAll(() => {
		vi.mock("@midl/executor", async (importOriginal) => ({
			...(await importOriginal<typeof import("@midl/executor")>()),
			addRuneERC20Intention: vi.fn().mockResolvedValue({}),
		}));
	});

	it("calls addERC20Rune with correct parameters", async () => {
		const { result } = renderHook(() => useAddRuneERC20Intention(), {
			wrapper,
		});

		result.current.addRuneERC20({
			runeId: "RUNENAME",
		});

		expect(result.current.error).toBeNull();

		await waitFor(() => result.current.isPending);
		await waitFor(() => result.current.isSuccess);

		expect(addRuneERC20Intention).toHaveBeenCalledWith(
			expect.any(Object),
			expect.any(Object),
			"RUNENAME",
		);
	});

	it("calls addERC20Rune with correct parameters when publish is false", async () => {
		const { result } = renderHook(() => useAddRuneERC20Intention(), {
			wrapper,
		});

		result.current.addRuneERC20({
			runeId: "RUNENAME",
		});

		await waitFor(() => result.current.isSuccess);

		expect(addRuneERC20Intention).toHaveBeenCalledWith(
			expect.any(Object),
			expect.any(Object),
			"RUNENAME",
		);
	});
});
