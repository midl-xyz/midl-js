import { AddressPurpose, connect, disconnect } from "@midl/core";
import { renderHook } from "@testing-library/react";
import { zeroAddress } from "viem";
import { describe, expect, it } from "vitest";
import { wrapper as Wrapper } from "~/__tests__";
import { midlConfig } from "~/__tests__/midlConfig";
import { useEVMAddress } from "~/hooks/useEVMAddress";

describe("useEVMAddress", () => {
	it("should return the correct value", async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});

		const { result } = renderHook(() => useEVMAddress(), {
			wrapper: Wrapper,
		});

		expect(result.current).toBe("0x7c88591052C56f2c0F94d34d4D73fcC1fDdbAFC1");

		await disconnect(midlConfig);
	});

	it("should not throw an error if no connection is available", () => {
		const { result } = renderHook(() => useEVMAddress(), {
			wrapper: ({ children }) => <Wrapper>{children}</Wrapper>,
		});

		expect(result.current).toBe(zeroAddress);
	});
});
