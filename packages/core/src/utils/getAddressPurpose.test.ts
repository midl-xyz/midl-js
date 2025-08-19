import { describe, expect, it } from "vitest";
import { mainnet } from "../networks/mainnet";
import { regtest } from "../networks/regtest";
import { signet } from "../networks/signet";
import { testnet } from "../networks/testnet";
import { testnet4 } from "../networks/testnet4";
import { getBitcoinAddress } from "./fixtures";
import { getAddressPurpose } from "./getAddressPurpose";

describe("core | utils | getAddressPurpose", () => {
	it("returns payment purpose for P2WPKH address", () => {
		const { p2wpkhMainnet } = getBitcoinAddress();
		const { p2wpkhTestnet } = getBitcoinAddress();
		const { p2wpkhRegtest } = getBitcoinAddress();

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2wpkhMainnet!, mainnet)).toBe("payment");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2wpkhTestnet!, testnet)).toBe("payment");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2wpkhTestnet!, signet)).toBe("payment");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2wpkhTestnet!, testnet4)).toBe("payment");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2wpkhRegtest!, regtest)).toBe("payment");
	});

	it("returns payment purpose for P2SH-P2WPKH address", () => {
		const { p2shMainnet } = getBitcoinAddress();
		const { p2shTestnet } = getBitcoinAddress();
		const { p2shRegtest } = getBitcoinAddress();

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2shMainnet!, mainnet)).toBe("payment");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2shTestnet!, testnet)).toBe("payment");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2shTestnet!, testnet4)).toBe("payment");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2shTestnet!, signet)).toBe("payment");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2shRegtest!, regtest)).toBe("payment");
	});

	it("returns originals purpose for P2TR address", () => {
		const { p2trMainnet } = getBitcoinAddress();
		const { p2trTestnet } = getBitcoinAddress();
		const { p2trRegtest } = getBitcoinAddress();

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2trMainnet!, mainnet)).toBe("ordinals");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2trTestnet!, testnet)).toBe("ordinals");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2trTestnet!, testnet4)).toBe("ordinals");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2trTestnet!, signet)).toBe("ordinals");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2trRegtest!, regtest)).toBe("ordinals");
	});

	it("returns payment purpose for P2PKH address", () => {
		const { p2pkhMainnet } = getBitcoinAddress();
		const { p2pkhTestnet } = getBitcoinAddress();
		const { p2pkhRegtest } = getBitcoinAddress();

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2pkhMainnet!, mainnet)).toBe("payment");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2pkhTestnet!, testnet)).toBe("payment");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2pkhTestnet!, testnet4)).toBe("payment");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2pkhTestnet!, signet)).toBe("payment");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2pkhRegtest!, regtest)).toBe("payment");
	});

	it("throws error if address that does not match the network configuration", () => {
		expect(() =>
			getAddressPurpose("0x1234567890abcdef1234567890abcdef12345678", mainnet),
		).toThrowError("The address does not match the network configuration.");

		expect(() =>
			getAddressPurpose("b c1qsdfghjklkdxt67hgfdgchvj56rtygh", testnet),
		).toThrowError("The address does not match the network configuration.");

		expect(() =>
			getAddressPurpose("bC1qsdfghjklkdxt67hgfdgchvj56rtygh", regtest),
		).toThrowError("The address does not match the network configuration.");
	});

	it("throws an error if the address type is unknown", () => {
		expect(() =>
			getAddressPurpose("bc1sdfghjklkdxt67hgfdgchvj56rtygh", mainnet),
		).toThrowError("Unknown address type");
		expect(() =>
			getAddressPurpose(
				"tb1dcl7dgyf2mqgzku2mfxt7jmucajr0y2j6hldum5x87gl087pfluqs0t6sf",
				testnet,
			),
		).toThrowError("Unknown address type");
		expect(() =>
			getAddressPurpose(
				"bcrt1muzq76mqg678y6hruzhe294qt3kmf0unt8khx4jvzz8979drpwyq7yyc69",
				regtest,
			),
		).toThrowError("Unknown address type");
	});
});
