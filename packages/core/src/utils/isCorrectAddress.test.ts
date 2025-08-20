import { describe, expect, it } from "vitest";
import { mainnet } from "../networks/mainnet";
import { regtest } from "../networks/regtest";
import { signet } from "../networks/signet";
import { testnet } from "../networks/testnet";
import { testnet4 } from "../networks/testnet4";
import { getBitcoinAddress } from "./fixtures/getBitcoinAddress";
import { isCorrectAddress } from "./isCorrectAddress";

describe("core | utils | isCorrectAddress", () => {
	it("returns true for P2WPKH addresses on all networks", () => {
		const { p2wpkhMainnet } = getBitcoinAddress();
		const { p2wpkhTestnet } = getBitcoinAddress();
		const { p2wpkhRegtest } = getBitcoinAddress();

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2wpkhMainnet!, mainnet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2wpkhTestnet!, testnet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2wpkhTestnet!, signet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2wpkhTestnet!, testnet4)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2wpkhRegtest!, regtest)).toBeTruthy;
	});

	it("returns true for P2SH-P2WPKH addresses on all networks", () => {
		const { p2shMainnet } = getBitcoinAddress();
		const { p2shTestnet } = getBitcoinAddress();
		const { p2shRegtest } = getBitcoinAddress();

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2shMainnet!, mainnet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2shTestnet!, testnet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2shTestnet!, testnet4)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2shTestnet!, signet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2shRegtest!, regtest)).toBeTruthy;
	});

	it("returns true for P2TR addresses on all networks", () => {
		const { p2trMainnet } = getBitcoinAddress();
		const { p2trTestnet } = getBitcoinAddress();
		const { p2trRegtest } = getBitcoinAddress();

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2trMainnet!, mainnet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2trTestnet!, testnet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2trTestnet!, testnet4)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2trTestnet!, signet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2trRegtest!, regtest)).toBeTruthy;
	});

	it("returns true for P2PKH addresses on all networks", () => {
		const { p2pkhMainnet } = getBitcoinAddress();
		const { p2pkhTestnet } = getBitcoinAddress();
		const { p2pkhRegtest } = getBitcoinAddress();

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2pkhMainnet!, mainnet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2pkhTestnet!, testnet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2pkhTestnet!, testnet4)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2pkhTestnet!, signet)).toBeTruthy;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(isCorrectAddress(p2pkhRegtest!, regtest)).toBeTruthy;
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
