import { describe, expect, it } from "vitest";
import { __TEST__MNEMONIC__ } from "~/__tests__/keyPair";
import { connect, EmptyAccountsError } from "~/actions/connect";
import { AddressPurpose } from "~/constants";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";

describe("core | actions | connect", async () => {
	const { keyPairConnector } = await import("@midl/node");

	it("connects", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [keyPairConnector({ mnemonic: __TEST__MNEMONIC__ })],
		});

		await connect(config, { purposes: [AddressPurpose.Ordinals] });

		const { accounts, connection, network } = config.getState();

		expect(accounts).toBeDefined();
		expect(connection).toBeDefined();
		expect(network).toBeDefined();
	});

	it("throws error if no accounts", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [keyPairConnector({ mnemonic: __TEST__MNEMONIC__ })],
		});

		await expect(
			connect(config, {
				purposes: [],
			}),
		).rejects.throw(EmptyAccountsError);
	});

	it("sorts accounts by purpose", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [keyPairConnector({ mnemonic: __TEST__MNEMONIC__ })],
		});

		await connect(config, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});

		const { accounts } = config.getState();

		expect(accounts?.[0]?.purpose).toBe(AddressPurpose.Payment);
		expect(accounts?.[1]?.purpose).toBe(AddressPurpose.Ordinals);
	});
});
