import { AddressPurpose, connect, disconnect } from "@midl-xyz/midl-js-core";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { wrapper as Wrapper } from "~/__tests__";
import { midlConfig } from "~/__tests__/midlConfig";
import { useDefaultAccount } from "~/hooks/useDefaultAccount";

describe("useDefaultAccount", () => {
	it("should return the correct value", async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
		});

		const { result } = renderHook(() => useDefaultAccount(), {
			wrapper: Wrapper,
		});

		expect(result.current?.purpose).toBe("payment");

		await disconnect(midlConfig);
	});

	it("should not throw an error if no connection is available", () => {
		const { result } = renderHook(() => useDefaultAccount(), {
			wrapper: ({ children }) => <Wrapper>{children}</Wrapper>,
		});

		expect(result.current).toBe(null);
	});

	it("should return taproot account if payment was not found", async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});

		const { result } = renderHook(() => useDefaultAccount(), {
			wrapper: Wrapper,
		});

		expect(result.current?.purpose).toBe("ordinals");

		await disconnect(midlConfig);
	});
});
