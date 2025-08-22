import { addRuneERC20 } from "@midl/executor";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { wrapper } from "~/__tests__";
import { useAddRuneERC20 } from "~/hooks/useAddRuneERC20";

describe("executor | hooks | useAddRuneERC20", () => {
	beforeAll(() => {
		vi.mock("@midl/executor", async (importOriginal) => ({
			...(await importOriginal<typeof import("@midl/executor")>()),
			addRuneERC20: vi.fn().mockResolvedValue({
				psbt: "base64-encoded-psbt",
				tx: {
					id: "tx-hash",
					hex: "transaction-hex",
				},
			}),
		}));
	});

	it("calls addERC20Rune with correct parameters", async () => {
		const { result } = renderHook(() => useAddRuneERC20(), { wrapper });

		result.current.addRuneERC20({
			runeId: "RUNE1234567890",
			publish: true,
		});

		expect(result.current.error).toBeNull();

		await waitFor(() => result.current.isPending);
		await waitFor(() => result.current.isSuccess);

		expect(result.current.data?.tx.hex).toBe("transaction-hex");

		expect(addRuneERC20).toHaveBeenCalledWith(
			expect.any(Object),
			expect.any(Object),
			"RUNE1234567890",
			{ publish: true },
		);
	});

	it("calls addERC20Rune with correct parameters when publish is false", async () => {
		const { result } = renderHook(() => useAddRuneERC20(), { wrapper });

		result.current.addRuneERC20({
			runeId: "RUNE1234567890",
			publish: false,
		});

		await waitFor(() => result.current.isSuccess);

		expect(result.current.data?.tx.hex).toBe("transaction-hex");
		expect(addRuneERC20).toHaveBeenCalledWith(
			expect.any(Object),
			expect.any(Object),
			"RUNE1234567890",
			{ publish: false },
		);
	});
});
