import { describe, expect, it } from "vitest";
import { getAddressType } from "./getAddressType";

describe("core | utils | getAddressType", () => {
	it("returns P2WPKH type", () => {
		expect(getAddressType("bc1qfh6wbp6cpnfsyn6390fhki84dbkplde28063n")).toBe(
			"p2wpkh",
		);
		expect(getAddressType("tb1qfnudxj052dbklpoe45vksxp5wa8tdbhops41ho")).toBe(
			"p2wpkh",
		);
		expect(getAddressType("bcrt1qfr0esii44wxvhipmjhdatecbhfdstriiuytfd")).toBe(
			"p2wpkh",
		);
	});

	it("returns P2SH-P2WPKH type", () => {
		expect(getAddressType("3844wxvhipmjhdatecbhfdstriifghj")).toBe(
			"p2sh_p2wpkh",
		);
		expect(getAddressType("244wxvhipmjhdatecbhfdstriiedrtfghbi")).toBe(
			"p2sh_p2wpkh",
		);
	});

	it("returns P2TR type", () => {
		expect(
			getAddressType(
				"bc1psdfghjklkdxt67hgfdgchvj56rtyghvvhgyiuhjhklpogfdse4567890",
			),
		).toBe("p2tr");
		expect(
			getAddressType(
				"tb1psdfghjklkdxt67hgfdgchvj56rtyghvvhgyiuhjhklpogfdse4567890",
			),
		).toBe("p2tr");

		expect(
			getAddressType(
				"bcrt1psdfghjklkdxt67hgfdgchvj56rtyghvvhgyiuhjhklpogfdse4567890",
			),
		).toBe("p2tr");
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

	it("returns correct type if address starts with a space", () => {
		expect(
			getAddressType(
				"    bc1psdfghjklkdxt67hgfdgchvj56rtyghvvhgyiuhjhklpogfdse4567890",
			),
		).toBe("p2tr");

		expect(
			getAddressType("     bc1qfh6wbp6cpnfsyn6390fhki84dbkplde28063n"),
		).toBe("p2wpkh");

		expect(getAddressType("   3844wxvhipmjhdatecbhfdstriifghj")).toBe(
			"p2sh_p2wpkh",
		);
	});

	it("throws error if enter empty string", () => {
		expect(() => getAddressType("")).toThrowError("Unknown address type");

		expect(() => getAddressType(" ")).toThrowError("Unknown address type");
	});
});
