import {
	type TransactionIntention,
	estimateBTCTransaction,
} from "@midl/executor";
import { renderHook, waitFor } from "@testing-library/react";
import { type Mock, afterEach, describe, expect, it, vi } from "vitest";
import { wrapper } from "~/__tests__";
import { useEstimateBTCTransaction } from "~/hooks/useEstimateBTCTransaction";

vi.mock("@midl/executor", async (importActual) => {
	const actual = await importActual<typeof import("@midl/executor")>();
	return {
		...actual,
		estimateBTCTransaction: vi.fn(),
	};
});

describe("executor-react | hooks | useEstimateBTCTransaction", () => {
	afterEach(() => {
		(estimateBTCTransaction as Mock).mockReset();
	});

	it("does't query if no intentions provided", () => {
		renderHook(() => useEstimateBTCTransaction([]), {
			wrapper,
		});

		expect(estimateBTCTransaction).not.toHaveBeenCalled();
	});

	it("queries if intentions provided", async () => {
		(estimateBTCTransaction as Mock).mockResolvedValue({
			fee: 1000,
			intentions: [],
		});
		const originalIntentions: TransactionIntention[] = [
			{
				evmTransaction: {
					to: "0x0000000000000000000000000000000000000000",
					value: 0n,
					chainId: 1,
				},
			},
		];

		const { result } = renderHook(
			() => useEstimateBTCTransaction(originalIntentions),
			{
				wrapper,
			},
		);

		expect(estimateBTCTransaction).toHaveBeenCalledWith(
			expect.any(Object), // config
			originalIntentions,
			expect.any(Object), // client
			{}, // options
		);

		await waitFor(() => {
			expect(result.current.data).toEqual({
				fee: 1000,
				intentions: [],
			});
		});
	});
});
