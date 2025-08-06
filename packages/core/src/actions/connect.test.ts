import { describe, expect, it } from "vitest";
import { __TEST__MNEMONIC__ } from "~/__tests__/keyPair";
import { EmptyAccountsError, connect } from "~/actions/connect";
import { AddressPurpose } from "~/constants";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";

describe("core | actions | connect", async () => {
	const { keyPairConnector } = await import("@midl-xyz/midl-js-node");

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

	it("throws error", async () => {
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
});
