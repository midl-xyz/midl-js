import { AddressPurpose, connect } from "@midl-xyz/midl-js-core";
import { render, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { wrapper as Wrapper } from "~/__tests__";
import { midlConfig } from "~/__tests__/midlConfig";
import { useEVMAddress } from "~/hooks/useEVMAddress";

const CustomComponent = () => {
	const evmAddress = useEVMAddress();

	return <div data-testid="evm-address">{evmAddress}</div>;
};

const renderWithWrapper = (children: React.ReactNode) => {
	return render(children, { wrapper: Wrapper });
};

describe("useEVMAddress", () => {
	beforeEach(async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});
	});

	it("should return the correct value", async () => {
		const { result } = renderHook(() => useEVMAddress(), {
			wrapper: Wrapper,
		});

		expect(result.current).toBe("0x8Ccf062691b33747c2C0950621992BCDe33A8d5C");
	});
});
