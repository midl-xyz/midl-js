import { AddressPurpose } from "@midl/core";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__/wrapper";
import { useConnect } from "~/hooks/useConnect";

describe("useConnect", () => {
	it("returns the correct values", () => {
		const { result } = renderHook(
			() =>
				useConnect({
					purposes: [AddressPurpose.Ordinals],
				}),
			{ wrapper },
		);

		expect("connect" in result.current).toBeTruthy();
		expect("connectAsync" in result.current).toBeTruthy();
		expect("connectors" in result.current).toBeTruthy();
	});
});
