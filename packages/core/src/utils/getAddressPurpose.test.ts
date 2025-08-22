import { describe, expect, it } from "vitest";
import { AddressPurpose } from "~/constants";
import { mainnet } from "../networks/mainnet";
import { regtest } from "../networks/regtest";
import { signet } from "../networks/signet";
import { testnet } from "../networks/testnet";
import { testnet4 } from "../networks/testnet4";
import { getBitcoinAddress } from "./fixtures";
import { getAddressPurpose } from "./getAddressPurpose";

describe("core | utils | getAddressPurpose", () => {
	const payment = AddressPurpose.Payment;
	const ordinals = AddressPurpose.Ordinals;
	it("returns payment purpose for P2WPKH address", () => {
		const { p2wpkhMainnet } = getBitcoinAddress();
		const { p2wpkhTestnet } = getBitcoinAddress();
		const { p2wpkhRegtest } = getBitcoinAddress();

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2wpkhMainnet.address!, mainnet)).toBe(payment);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2wpkhTestnet.address!, testnet)).toBe(payment);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2wpkhTestnet.address!, signet)).toBe(payment);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2wpkhTestnet.address!, testnet4)).toBe(payment);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2wpkhRegtest.address!, regtest)).toBe(payment);
	});

	it("returns payment purpose for P2SH-P2WPKH address", () => {
		const { p2shMainnet } = getBitcoinAddress();
		const { p2shTestnet } = getBitcoinAddress();
		const { p2shRegtest } = getBitcoinAddress();

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2shMainnet.address!, mainnet)).toBe(payment);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2shTestnet.address!, testnet)).toBe(payment);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2shTestnet.address!, testnet4)).toBe(payment);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2shTestnet.address!, signet)).toBe(payment);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2shRegtest.address!, regtest)).toBe(payment);
	});

	it("returns originals purpose for P2TR address", () => {
		const { p2trMainnet } = getBitcoinAddress();
		const { p2trTestnet } = getBitcoinAddress();
		const { p2trRegtest } = getBitcoinAddress();

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2trMainnet.address!, mainnet)).toBe(ordinals);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2trTestnet.address!, testnet)).toBe(ordinals);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2trTestnet.address!, testnet4)).toBe(ordinals);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2trTestnet.address!, signet)).toBe(ordinals);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2trRegtest.address!, regtest)).toBe(ordinals);
	});

	it("throws error if address that does not match the network configuration", () => {
		const { p2trMainnet } = getBitcoinAddress();
		const { p2trTestnet } = getBitcoinAddress();
		const { p2trRegtest } = getBitcoinAddress();

		expect(() =>
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			getAddressPurpose(p2trMainnet.address!, testnet),
		).toThrowError("The address does not match the network configuration.");

		expect(() =>
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			getAddressPurpose(p2trTestnet.address!, regtest),
		).toThrowError("The address does not match the network configuration.");

		expect(() =>
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			getAddressPurpose(p2trRegtest.address!, mainnet),
		).toThrowError("The address does not match the network configuration.");
	});

	it("throws an error if the address type is unknown", () => {
		/**
		 * On testnet/regtest, addresses with incorrect address type can start with either 'm' or 'n'.
		 * For predictability, addresses are always normalized to start with 'm'
		 */

		const {
			incorrectAddressTypeAddressMainnet,
			incorrectAddressTypeAddressTestnet,
			incorrectAddressTypeAddressRegtest,
		} = getBitcoinAddress();
		expect(() =>
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			getAddressPurpose(incorrectAddressTypeAddressMainnet.address!, mainnet),
		).toThrowError("Unknown address type");

		expect(() =>
			getAddressPurpose(
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				`m${incorrectAddressTypeAddressTestnet.address!.slice(1)}`,
				testnet,
			),
		).toThrowError("Unknown address type");

		expect(() =>
			getAddressPurpose(
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				`m${incorrectAddressTypeAddressRegtest.address!.slice(1)}`,
				regtest,
			),
		).toThrowError("Unknown address type");
	});
});
