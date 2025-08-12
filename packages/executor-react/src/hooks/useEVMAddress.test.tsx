import { AddressPurpose, connect, disconnect } from "@midl-xyz/midl-js-core";
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

		expect(result.current).toBe("0x5E5b88DEfa1A412C69644CB47E68107d97807E35");

		await disconnect(midlConfig);
	});

	it("should not throw an error if no connection is available", () => {
		const { result } = renderHook(() => useEVMAddress(), {
			wrapper: ({ children }) => <Wrapper>{children}</Wrapper>,
		});

		expect(result.current).toBe(zeroAddress);
	});
});
