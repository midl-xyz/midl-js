import { AddressPurpose, connect } from "@midl/core";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { midlConfig, wrapper } from "~/__tests__/wrapper";
import { useConfig } from "~/hooks/useConfig";

describe("useConfig", () => {
	it.skip("returns the current connection", async () => {
		const { result, rerender } = renderHook(() => useConfig(), {
			wrapper,
		});
		expect(result.current.connection).toBeUndefined();
		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});
		rerender();
		expect(result.current.connection).toBeDefined();
	});

	it("returns config w/o context", () => {
		const { result } = renderHook(() => useConfig(midlConfig));

		expect(result.current.network).toEqual(midlConfig.getState().network);
	});
});
