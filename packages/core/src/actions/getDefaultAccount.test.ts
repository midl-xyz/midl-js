import { describe, expect, it } from "vitest";
import { __TEST__MNEMONIC__ } from "~/__tests__/keyPair";
import { WalletConnectionError, connect } from "~/actions/connect";
import { AddressPurpose } from "~/constants";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";
import { getDefaultAccount } from "./getDefaultAccount";

describe("core | actions | getDefaultAccount", async () => {
	const { keyPairConnector } = await import("@midl/node");
	const ordinalsAddress =
		"bcrt1puwn2akldaf2hqv64kmkjt3lgutk4se8rlmr8rcpk2v0ygg6zqqtqzzjdq9";
	const paymentAddress = "bcrt1qz4yz7junaupmav0ycmwheglahya7wuy0g7n6tc";

	it("throws error if no connection", () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
		});

		expect(() => getDefaultAccount(config)).toThrow(WalletConnectionError);
	});

	it("returns default payment account correctly if purposes is payment", async () => {
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
		expect(account.address).to.be.equal(paymentAddress);
	});

	it("returns default ordinals account correctly if purposes is ordinals", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [
				keyPairConnector({
					mnemonic: __TEST__MNEMONIC__,
				}),
			],
		});

		await connect(config, {
			purposes: [AddressPurpose.Ordinals],
		});

		const account = getDefaultAccount(config);
		expect(account.address).to.be.equal(ordinalsAddress);
	});

	it("returns default payment account correctly if purposes is both payment and ordinals", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [
				keyPairConnector({
					mnemonic: __TEST__MNEMONIC__,
				}),
			],
		});

		await connect(config, {
			purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
		});

		const account = getDefaultAccount(config);
		expect(account.address).to.be.equal(paymentAddress);
	});

	it("returns default ordinals account correctly if default purpose is set to ordinals", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [
				keyPairConnector({
					mnemonic: __TEST__MNEMONIC__,
				}),
			],
			defaultPurpose: AddressPurpose.Ordinals,
		});

		await connect(config, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});

		const account = getDefaultAccount(config);
		expect(account.address).to.be.equal(ordinalsAddress);
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
		expect(expectedAccount.address).to.be.equal(ordinalsAddress);
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
