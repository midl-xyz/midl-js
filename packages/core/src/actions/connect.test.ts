import { describe, expect, it } from "vitest";
import { getKeyPair } from "~/__tests__/keyPair";
import { EmptyAccountsError, connect } from "~/actions/connect";
import { KeyPairConnector } from "~/connectors";
import { AddressPurpose } from "~/constants";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";

describe("core | actions | connect", () => {
	it("connects", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [new KeyPairConnector(getKeyPair())],
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
			connectors: [new KeyPairConnector(getKeyPair())],
		});

		expect(
			connect(config, {
				purposes: [],
			}),
		).rejects.throw(EmptyAccountsError);
	});
});
