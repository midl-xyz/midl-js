import { describe, expect, it } from "vitest";
import { getBitcoinAddress } from "./fixtures";
import { getAddressType } from "./getAddressType";

describe("core | utils | getAddressType", () => {
	it("returns P2WPKH type", () => {
		const { p2wpkhMainnet, p2wpkhTestnet, p2wpkhRegtest } = getBitcoinAddress();

		expect(getAddressType(p2wpkhMainnet.address)).toBe("p2wpkh");
		expect(getAddressType(p2wpkhTestnet.address)).toBe("p2wpkh");
		expect(getAddressType(p2wpkhRegtest.address)).toBe("p2wpkh");
	});

	it("returns P2SH-P2WPKH type", () => {
		const { p2shMainnet, p2shTestnet, p2shRegtest } = getBitcoinAddress();

		expect(getAddressType(p2shMainnet.address)).toBe("p2sh_p2wpkh"); //3
		expect(getAddressType(p2shTestnet.address)).toBe("p2sh_p2wpkh"); //2
		expect(getAddressType(p2shRegtest.address)).toBe("p2sh_p2wpkh"); //2
	});

	it("returns P2TR type", () => {
		const { p2trMainnet, p2trTestnet, p2trRegtest } = getBitcoinAddress();

		expect(getAddressType(p2trMainnet.address)).toBe("p2tr");
		expect(getAddressType(p2trTestnet.address)).toBe("p2tr");
		expect(getAddressType(p2trRegtest.address)).toBe("p2tr");
	});

	it("throws error if enter unknown address type", () => {
		expect(() =>
			getAddressType("0x1234567890abcdef1234567890abcdef12345678"),
		).toThrowError("Unknown address type");

		expect(() =>
			getAddressType("bc1sdfghjklkdxt67hgfdgchvj56rtygh"),
		).toThrowError("Unknown address type");

		expect(() =>
			getAddressType("b c1qsdfghjklkdxt67hgfdgchvj56rtygh"),
		).toThrowError("Unknown address type");

		expect(() =>
			getAddressType("bC1qsdfghjklkdxt67hgfdgchvj56rtygh"),
		).toThrowError("Unknown address type");
	});
});
