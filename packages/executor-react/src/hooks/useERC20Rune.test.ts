import { renderHook, waitFor } from "@testing-library/react";
import { zeroAddress } from "viem";
import { describe, expect, it, vi } from "vitest";
import { wrapper } from "~/__tests__";
import { useERC20Rune } from "~/hooks/useERC20Rune";

vi.mock("@midl/react", async (importOriginal) => {
	return {
		...(await importOriginal<typeof import("@midl/react")>()),
		useRune: vi.fn().mockImplementation(({ runeId }) => {
			const state = {
				rune: {
					id: runeId,
					name: `NAME${runeId.replace(":", "")}`,
				},
				isSuccess: true,
			};
			return state;
		}),
	};
});

vi.mock("wagmi", async (importOriginal) => {
	return {
		...(await importOriginal<typeof import("wagmi")>()),
		useReadContract: vi.fn().mockImplementation(() => {
			const state = {
				data: zeroAddress,
				isSuccess: true,
			};
			return state;
		}),
	};
});

describe("useERC20Rune", () => {
	it("should return the correct value", async () => {
		const { result } = renderHook(() => useERC20Rune("1:1"), {
			wrapper,
		});

		await waitFor(() => expect(result.current.state.isSuccess).toBe(true));

		expect(result.current.rune?.name).toBe("NAME11");

		await waitFor(() => expect(result.current.erc20State.isSuccess).toBe(true));

		expect(result.current.erc20Address).toBe(zeroAddress);
	});
});
