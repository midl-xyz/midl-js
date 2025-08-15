import ecc from "@bitcoinerlab/secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import { describe, expect, it } from "vitest";
import { getAddressType } from "./getAddressType";

describe("core | utils | getAddressType", () => {
	const ECPair = ECPairFactory(ecc);
	bitcoin.initEccLib(ecc);

	const mainnet = bitcoin.networks.bitcoin;
	const regtest = bitcoin.networks.regtest;
	const testnet = bitcoin.networks.testnet;

	const keyPairMainnet = ECPair.makeRandom({ network: mainnet });
	const keyPairTestnet = ECPair.makeRandom({ network: testnet });
	const keyPairRegtest = ECPair.makeRandom({ network: regtest });

	it("returns P2WPKH type", () => {
		const { address: p2wpkhMainnet } = bitcoin.payments.p2wpkh({
			pubkey: keyPairMainnet.publicKey,
			network: mainnet,
		});

		const { address: p2wpkhTestnet } = bitcoin.payments.p2wpkh({
			pubkey: keyPairTestnet.publicKey,
			network: testnet,
		});

		const { address: p2wpkhRegtest } = bitcoin.payments.p2wpkh({
			pubkey: keyPairRegtest.publicKey,
			network: regtest,
		});
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressType(p2wpkhMainnet!)).toBe("p2wpkh");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressType(p2wpkhTestnet!)).toBe("p2wpkh");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressType(p2wpkhRegtest!)).toBe("p2wpkh");
	});

	it("returns P2SH-P2WPKH type", () => {
		const { address: p2wpkhMainnet } = bitcoin.payments.p2sh({
			redeem: bitcoin.payments.p2wpkh({
				pubkey: keyPairMainnet.publicKey,
				network: mainnet,
			}),
			network: mainnet,
		});

		const { address: p2wpkhTestnet } = bitcoin.payments.p2sh({
			redeem: bitcoin.payments.p2wpkh({
				pubkey: keyPairTestnet.publicKey,
				network: testnet,
			}),
			network: testnet,
		});

		const { address: p2wpkhRegtest } = bitcoin.payments.p2sh({
			redeem: bitcoin.payments.p2wpkh({
				pubkey: keyPairRegtest.publicKey,
				network: regtest,
			}),
			network: regtest,
		});
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressType(p2wpkhMainnet!)).toBe("p2sh_p2wpkh"); //3
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressType(p2wpkhTestnet!)).toBe("p2sh_p2wpkh"); //2
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressType(p2wpkhRegtest!)).toBe("p2sh_p2wpkh"); //2

		console.log(p2wpkhTestnet, p2wpkhMainnet, p2wpkhRegtest);
	});

	it("returns P2TR type", () => {
		const { address: p2trMainnet } = bitcoin.payments.p2tr({
			pubkey: keyPairMainnet.publicKey.slice(1, 33),
			network: mainnet,
		});

		const { address: p2trTestnet } = bitcoin.payments.p2tr({
			pubkey: keyPairTestnet.publicKey.slice(1, 33),
			network: testnet,
		});

		const { address: p2trRegtest } = bitcoin.payments.p2tr({
			pubkey: keyPairRegtest.publicKey.slice(1, 33),
			network: regtest,
		});
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressType(p2trMainnet!)).toBe("p2tr");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressType(p2trTestnet!)).toBe("p2tr");
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressType(p2trRegtest!)).toBe("p2tr");
	});

	it("returns P2PKH type", () => {
		const { address: p2pkhMainnet } = bitcoin.payments.p2pkh({
			pubkey: keyPairMainnet.publicKey,
			network: mainnet,
		});

		const { address: p2pkhTestnet } = bitcoin.payments.p2pkh({
			pubkey: keyPairTestnet.publicKey,
			network: testnet,
		});

		const { address: p2pkhRegtest } = bitcoin.payments.p2pkh({
			pubkey: keyPairRegtest.publicKey,
			network: regtest,
		});
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressType(p2pkhMainnet!)).toBe("p2pkh"); // 1
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressType(p2pkhTestnet!)).toBe("p2pkh"); // mx
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		expect(getAddressType(p2pkhRegtest!)).toBe("p2pkh"); // mpx
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
