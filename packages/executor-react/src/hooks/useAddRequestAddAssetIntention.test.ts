import { AddressPurpose, connect } from "@midl/core";
import { createStore } from "@midl/react";
import { renderHook, waitFor } from "@testing-library/react";
import { zeroAddress } from "viem";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { wrapper } from "~/__tests__";
import { midlConfig } from "~/__tests__/midlConfig";
import { useAddRequestAddAssetsIntention } from "~/hooks/useAddRequestAddAssetIntention";

vi.mock("@midl/executor", async (importOriginal) => ({
	...(await importOriginal<typeof import("@midl/executor")>()),
	addRequestAddAssetIntention: vi.fn().mockResolvedValue({
		evmTransaction: {
			to: zeroAddress,
			data: "0xdata",
		},
		deposit: {
			runes: [],
		},
	}),
}));

describe("useAddRequestAddAssetIntention", () => {
	const store = createStore({
		intentions: [],
	});

	beforeEach(() => {
		connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});
	});

	it("should add intention to the store", async () => {
		const { result } = renderHook(
			() => useAddRequestAddAssetsIntention({ store }),
			{
				wrapper,
			},
		);

		result.current.addRequestAddAssetIntention({
			runeId: "TESTRUNE",
			address: zeroAddress,
			amount: 1n,
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(store.getState().intentions).toHaveLength(1);
	});
});
