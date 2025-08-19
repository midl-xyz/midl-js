import ecc from "@bitcoinerlab/secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import { describe, expect, it } from "vitest";
import { mainnet } from "../networks/mainnet";
import { regtest } from "../networks/regtest";
import { signet } from "../networks/signet";
import { testnet } from "../networks/testnet";
import { testnet4 } from "../networks/testnet4";
import { getAddressPurpose } from "./getAddressPurpose";

describe("core | utils | getAddressPurpose", () => {
	const ECPair = ECPairFactory(ecc);
	bitcoin.initEccLib(ecc);

	const mainnetNetwork = bitcoin.networks.bitcoin;
	const regtestNetwork = bitcoin.networks.regtest;
	const testnetNetwork = bitcoin.networks.testnet;

	const keyPairMainnet = ECPair.makeRandom({ network: mainnetNetwork });
	const keyPairTestnet = ECPair.makeRandom({ network: testnetNetwork });
	const keyPairRegtest = ECPair.makeRandom({ network: regtestNetwork });

	it("returns payment purpose for P2WPKH address", () => {
		const { address: p2wpkhMainnet } = bitcoin.payments.p2wpkh({
			pubkey: keyPairMainnet.publicKey,
			network: mainnetNetwork,
		});

		const { address: p2wpkhTestnet } = bitcoin.payments.p2wpkh({
			pubkey: keyPairTestnet.publicKey,
			network: testnetNetwork,
		});

		const { address: p2wpkhRegtest } = bitcoin.payments.p2wpkh({
			pubkey: keyPairRegtest.publicKey,
			network: regtestNetwork,
		});
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
		const { address: p2shMainnet } = bitcoin.payments.p2sh({
			redeem: bitcoin.payments.p2wpkh({
				pubkey: keyPairMainnet.publicKey,
				network: mainnetNetwork,
			}),
			network: mainnetNetwork,
		});

		const { address: p2shTestnet } = bitcoin.payments.p2sh({
			redeem: bitcoin.payments.p2wpkh({
				pubkey: keyPairTestnet.publicKey,
				network: testnetNetwork,
			}),
			network: testnetNetwork,
		});

		const { address: p2shRegtest } = bitcoin.payments.p2sh({
			redeem: bitcoin.payments.p2wpkh({
				pubkey: keyPairRegtest.publicKey,
				network: regtestNetwork,
			}),
			network: regtestNetwork,
		});
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2shMainnet!, mainnet)).toBe("payment"); //3
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2shTestnet!, testnet)).toBe("payment"); //2
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2shTestnet!, testnet4)).toBe("payment"); //2
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2shTestnet!, signet)).toBe("payment"); //2
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2shRegtest!, regtest)).toBe("payment"); //2
	});

	it("returns originals purpose for P2TR address", () => {
		const { address: p2trMainnet } = bitcoin.payments.p2tr({
			pubkey: keyPairMainnet.publicKey.slice(1, 33),
			network: mainnetNetwork,
		});

		const { address: p2trTestnet } = bitcoin.payments.p2tr({
			pubkey: keyPairTestnet.publicKey.slice(1, 33),
			network: testnetNetwork,
		});

		const { address: p2trRegtest } = bitcoin.payments.p2tr({
			pubkey: keyPairRegtest.publicKey.slice(1, 33),
			network: regtestNetwork,
		});

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

	it.skip("returns payment purpose for P2PKH address", () => {
		const { address: p2pkhMainnet } = bitcoin.payments.p2pkh({
			pubkey: keyPairMainnet.publicKey,
			network: mainnetNetwork,
		});

		const { address: p2pkhTestnet } = bitcoin.payments.p2pkh({
			pubkey: keyPairTestnet.publicKey,
			network: testnetNetwork,
		});

		const { address: p2pkhRegtest } = bitcoin.payments.p2pkh({
			pubkey: keyPairRegtest.publicKey,
			network: regtestNetwork,
		});
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2pkhMainnet!, mainnet)).toBe("payment"); // 1
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2pkhTestnet!, testnet)).toBe("payment"); // mx
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2pkhTestnet!, testnet4)).toBe("payment"); // mx
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2pkhTestnet!, signet)).toBe("payment"); // mx
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressPurpose(p2pkhRegtest!, regtest)).toBe("payment"); // mpx
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
