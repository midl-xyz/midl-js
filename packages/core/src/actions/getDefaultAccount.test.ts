import { describe, expect, it } from "vitest";
import { __TEST__MNEMONIC__ } from "~/__tests__/keyPair";
import { WalletConnectionError, connect } from "~/actions/connect";
import { AddressPurpose } from "~/constants";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";
import { getDefaultAccount } from "./getDefaultAccount";

describe("core | actions | getDefaultAccount", async () => {
	const { keyPairConnector } = await import("@midl/node");

	it("throws error if no connection", () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
		});

		expect(() => getDefaultAccount(config)).toThrow(WalletConnectionError);
	});

	it("returns default account correctly", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [
				keyPairConnector({
					mnemonic: __TEST__MNEMONIC__,
				}),
			],
		});

		await connect(config, {
			purposes: [AddressPurpose.Payment],
		});

		const account = getDefaultAccount(config);
		expect(account.address).to.be.equal(
			"bcrt1qz4yz7junaupmav0ycmwheglahya7wuy0g7n6tc",
		);
	});

	it("returns the correct account matching the predicate", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [keyPairConnector({ mnemonic: __TEST__MNEMONIC__ })],
		});

		await connect(config, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});

		const expectedAccount = getDefaultAccount(
			config,
			(account) => account.purpose === AddressPurpose.Ordinals,
		);
		expect(expectedAccount.address).to.be.equal(
			"bcrt1puwn2akldaf2hqv64kmkjt3lgutk4se8rlmr8rcpk2v0ygg6zqqtqzzjdq9",
		);
	});

	it("throws error if no match predicate", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [keyPairConnector({ mnemonic: __TEST__MNEMONIC__ })],
		});

		await connect(config, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});

		expect(() =>
			getDefaultAccount(
				config,
				(account) => account.publicKey === "12345678901234567890",
			),
		).toThrow("No account found matching the predicate");
	});
});
