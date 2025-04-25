import { AddressPurpose, connect } from "@midl-xyz/midl-js-core";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { midlConfig, wrapper } from "~/__tests__/wrapper";
import { useConfig } from "~/hooks/useConfig";

describe("useConfig", () => {
	it("should return the current connection", async () => {
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
});
