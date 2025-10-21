import { describe, expect, it } from "vitest";
import { mainnet } from "../networks/mainnet";
import { regtest } from "../networks/regtest";
import { signet } from "../networks/signet";
import { testnet } from "../networks/testnet";
import { testnet4 } from "../networks/testnet4";
import { getBitcoinAddress } from "./fixtures";
import { isCorrectAddress } from "./isCorrectAddress";

describe("core | utils | isCorrectAddress", () => {
	it("returns true for P2WPKH addresses on all networks", () => {
		const { p2wpkhMainnet, p2wpkhTestnet, p2wpkhRegtest } = getBitcoinAddress();

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2wpkhMainnet.address!, mainnet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2wpkhTestnet.address!, testnet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2wpkhTestnet.address!, signet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2wpkhTestnet.address!, testnet4)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2wpkhRegtest.address!, regtest)).toBeTruthy;
	});

	it("returns true for P2SH-P2WPKH addresses on all networks", () => {
		const { p2shMainnet, p2shTestnet, p2shRegtest } = getBitcoinAddress();

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2shMainnet.address!, mainnet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2shTestnet.address!, testnet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2shTestnet.address!, testnet4)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2shTestnet.address!, signet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2shRegtest.address!, regtest)).toBeTruthy;
	});

	it("returns true for P2TR addresses on all networks", () => {
		const { p2trMainnet, p2trTestnet, p2trRegtest } = getBitcoinAddress();

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2trMainnet.address!, mainnet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2trTestnet.address!, testnet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2trTestnet.address!, testnet4)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2trTestnet.address!, signet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2trRegtest.address!, regtest)).toBeTruthy;
	});

	it("throws error if address that does not match the network configuration", () => {
		expect(() =>
			isCorrectAddress("0x1234567890abcdef1234567890abcdef12345678", mainnet),
		).toThrowError("Address is incorrect");

		expect(() =>
			isCorrectAddress("0x1234567890abcdef1234567890abcdef12345678", testnet),
		).toThrowError("Address is incorrect");

		expect(() =>
			isCorrectAddress("0x1234567890abcdef1234567890abcdef12345678", regtest),
		).toThrowError("Address is incorrect");
	});
});
