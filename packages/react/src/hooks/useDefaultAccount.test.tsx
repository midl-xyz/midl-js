import { AddressPurpose, connect, disconnect } from "@midl/core";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { midlConfig, wrapper } from "~/__tests__/wrapper";
import { useDefaultAccount } from "~/hooks/useDefaultAccount";

describe("useDefaultAccount", () => {
	it("should return the correct value", async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
		});

		const { result } = renderHook(
			() => useDefaultAccount({ config: midlConfig }),
			{
				wrapper,
			},
		);

		expect(result.current?.purpose).toBe(AddressPurpose.Payment);

		await disconnect(midlConfig);
	});

	it("should not throw an error if no connection is available", () => {
		const { result } = renderHook(
			() => useDefaultAccount({ config: midlConfig }),
			{
				wrapper,
			},
		);

		expect(result.current).toBe(null);
	});

	it("should return taproot account if payment was not found", async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});

		const { result } = renderHook(
			() => useDefaultAccount({ config: midlConfig }),
			{
				wrapper,
			},
		);

		expect(result.current?.purpose).toBe(AddressPurpose.Ordinals);

		await disconnect(midlConfig);
	});
});
