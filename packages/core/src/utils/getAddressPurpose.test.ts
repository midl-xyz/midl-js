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
		const { p2wpkhMainnet, p2wpkhTestnet, p2wpkhRegtest } = getBitcoinAddress();

		expect(getAddressPurpose(p2wpkhMainnet.address as string, mainnet)).toBe(
			payment,
		);
		expect(getAddressPurpose(p2wpkhTestnet.address as string, testnet)).toBe(
			payment,
		);
		expect(getAddressPurpose(p2wpkhTestnet.address as string, signet)).toBe(
			payment,
		);
		expect(getAddressPurpose(p2wpkhTestnet.address as string, testnet4)).toBe(
			payment,
		);
		expect(getAddressPurpose(p2wpkhRegtest.address as string, regtest)).toBe(
			payment,
		);
	});

	it("returns payment purpose for P2SH-P2WPKH address", () => {
		const { p2shMainnet, p2shTestnet, p2shRegtest } = getBitcoinAddress();

		expect(getAddressPurpose(p2shMainnet.address as string, mainnet)).toBe(
			payment,
		);
		expect(getAddressPurpose(p2shTestnet.address as string, testnet)).toBe(
			payment,
		);
		expect(getAddressPurpose(p2shTestnet.address as string, testnet4)).toBe(
			payment,
		);
		expect(getAddressPurpose(p2shTestnet.address as string, signet)).toBe(
			payment,
		);
		expect(getAddressPurpose(p2shRegtest.address as string, regtest)).toBe(
			payment,
		);
	});

	it("returns originals purpose for P2TR address", () => {
		const { p2trMainnet, p2trTestnet, p2trRegtest } = getBitcoinAddress();

		expect(getAddressPurpose(p2trMainnet.address as string, mainnet)).toBe(
			ordinals,
		);
		expect(getAddressPurpose(p2trTestnet.address as string, testnet)).toBe(
			ordinals,
		);
		expect(getAddressPurpose(p2trTestnet.address as string, testnet4)).toBe(
			ordinals,
		);
		expect(getAddressPurpose(p2trTestnet.address as string, signet)).toBe(
			ordinals,
		);
		expect(getAddressPurpose(p2trRegtest.address as string, regtest)).toBe(
			ordinals,
		);
	});

	it("throws error if address that does not match the network configuration", () => {
		const { p2trMainnet, p2trTestnet, p2trRegtest } = getBitcoinAddress();

		expect(() =>
			getAddressPurpose(p2trMainnet.address as string, testnet),
		).toThrowError("The address does not match the network configuration.");

		expect(() =>
			getAddressPurpose(p2trTestnet.address as string, regtest),
		).toThrowError("The address does not match the network configuration.");

		expect(() =>
			getAddressPurpose(p2trRegtest.address as string, mainnet),
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
			getAddressPurpose(
				incorrectAddressTypeAddressMainnet.address as string,
				mainnet,
			),
		).toThrowError("Unknown address type");

		expect(() =>
			getAddressPurpose(
				`m${(incorrectAddressTypeAddressTestnet.address as string).slice(1)}`,
				testnet,
			),
		).toThrowError("Unknown address type");

		expect(() =>
			getAddressPurpose(
				`m${(incorrectAddressTypeAddressRegtest.address as string).slice(1)}`,
				regtest,
			),
		).toThrowError("Unknown address type");
	});
});
