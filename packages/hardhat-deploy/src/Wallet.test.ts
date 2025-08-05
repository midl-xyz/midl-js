import {
	AddressPurpose,
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
		const wallet = new Wallet(mnemonic, regtest, DerivationPath.Xverse.testnet);

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
		const wallet = new Wallet(mnemonic, regtest, DerivationPath.Xverse.testnet);

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
			DerivationPath.Leather.testnet,
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
			DerivationPath.Leather.testnet,
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
});
