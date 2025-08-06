import {
	AddressPurpose,
	AddressType,
	connect,
	createConfig,
	getDefaultAccount,
	regtest,
} from "@midl-xyz/midl-js-core";
import { keyPairConnector } from "@midl-xyz/midl-js-node";
import { describe, expect, it } from "vitest";
import { DerivationPath, Wallet } from "~/Wallet";

// DON'T USE THIS IN PRODUCTION, IT IS FOR TESTING PURPOSES ONLY. THIS IS AN EXPOSED MNEMONIC.
const mnemonic =
	"face spike layer label health knee cry taste carpet found elegant october";

describe("Wallet", () => {
	it("derives addresses the same way as xverse", async () => {
		const wallet = new Wallet(
			mnemonic,
			regtest,
			DerivationPath.Xverse[AddressType.P2TR].testnet,
		);

		const keyPair = wallet.getAccount(0);

		const config = createConfig({
			connectors: [keyPairConnector({ keyPair: keyPair })],
			networks: [regtest],
		});

		await connect(config, { purposes: [AddressPurpose.Ordinals] });

		expect(getDefaultAccount(config).address).toBe(
			"bcrt1puwn2akldaf2hqv64kmkjt3lgutk4se8rlmr8rcpk2v0ygg6zqqtqzzjdq9",
		);
	});

	it("derives addresses the same way as xverse 1", async () => {
		const wallet = new Wallet(
			mnemonic,
			regtest,
			DerivationPath.Xverse[AddressType.P2TR].testnet,
		);

		const keyPair = wallet.getAccount(1);

		const config = createConfig({
			connectors: [keyPairConnector({ keyPair: keyPair })],
			networks: [regtest],
		});

		await connect(config, { purposes: [AddressPurpose.Ordinals] });

		expect(getDefaultAccount(config).address).toBe(
			"bcrt1p50tstmuar4gz00lpdsf6qc6rwa3hcjemxnhqdf9s2e73tyfllgkqkw9y74",
		);
	});

	it("derives addresses the same way as leather", async () => {
		const wallet = new Wallet(
			mnemonic,
			regtest,
			DerivationPath.Leather[AddressType.P2TR].testnet,
		);

		const keyPair = wallet.getAccount(0);

		const config = createConfig({
			connectors: [keyPairConnector({ keyPair: keyPair })],
			networks: [regtest],
		});

		await connect(config, { purposes: [AddressPurpose.Ordinals] });

		expect(getDefaultAccount(config).address).toBe(
			"bcrt1puwn2akldaf2hqv64kmkjt3lgutk4se8rlmr8rcpk2v0ygg6zqqtqzzjdq9",
		);
	});

	it("derives addresses the same way as leather ", async () => {
		const wallet = new Wallet(
			mnemonic,
			regtest,
			DerivationPath.Leather[AddressType.P2TR].testnet,
		);
		const keyPair = wallet.getAccount(1);

		const config = createConfig({
			connectors: [keyPairConnector({ keyPair: keyPair })],
			networks: [regtest],
		});

		await connect(config, { purposes: [AddressPurpose.Ordinals] });

		expect(getDefaultAccount(config).address).toBe(
			"bcrt1p50tstmuar4gz00lpdsf6qc6rwa3hcjemxnhqdf9s2e73tyfllgkqkw9y74",
		);
	});

	it("derives p2wpkh addresses leahter", async () => {
		const wallet = new Wallet(
			mnemonic,
			regtest,
			DerivationPath.Leather[AddressType.P2WPKH].testnet,
		);
		const keyPair = wallet.getAccount(0);

		const config = createConfig({
			connectors: [keyPairConnector({ keyPair: keyPair })],
			networks: [regtest],
		});

		await connect(config, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});

		expect(getDefaultAccount(config).address).toBe(
			"bcrt1qz4yz7junaupmav0ycmwheglahya7wuy0g7n6tc",
		);
	});

	it("derives p2wpkh addresses leahter", async () => {
		const wallet = new Wallet(
			mnemonic,
			regtest,
			DerivationPath.Leather[AddressType.P2WPKH].testnet,
		);
		const keyPair = wallet.getAccount(1);

		const config = createConfig({
			connectors: [keyPairConnector({ keyPair: keyPair })],
			networks: [regtest],
		});

		await connect(config, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});

		expect(getDefaultAccount(config).address).toBe(
			"bcrt1qldp99gjlh5qhj624qu9hg7cw3tztj0h6urds2z",
		);
	});

	it("derives p2wpkh addresses xverse", async () => {
		const wallet = new Wallet(
			mnemonic,
			regtest,
			DerivationPath.Xverse[AddressType.P2WPKH].testnet,
		);
		const keyPair = wallet.getAccount(0);

		const config = createConfig({
			connectors: [keyPairConnector({ keyPair: keyPair })],
			networks: [regtest],
		});

		await connect(config, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});

		expect(getDefaultAccount(config).address).toBe(
			"bcrt1qz4yz7junaupmav0ycmwheglahya7wuy0g7n6tc",
		);
	});

	it("derives p2wpkh addresses xverse", async () => {
		const wallet = new Wallet(
			mnemonic,
			regtest,
			DerivationPath.Xverse[AddressType.P2WPKH].testnet,
		);
		const keyPair = wallet.getAccount(1);

		const config = createConfig({
			connectors: [keyPairConnector({ keyPair: keyPair })],
			networks: [regtest],
		});

		await connect(config, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});

		expect(getDefaultAccount(config).address).toBe(
			"bcrt1qldp99gjlh5qhj624qu9hg7cw3tztj0h6urds2z",
		);
	});
});
