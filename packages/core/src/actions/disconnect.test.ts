import { describe, expect, it, vi } from "vitest";
import { __TEST__MNEMONIC__ } from "~/__tests__/keyPair";
import { connect } from "~/actions/connect";
import { disconnect } from "~/actions/disconnect";
import type { Connector } from "~/connectors";
import { AddressPurpose } from "~/constants";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";

describe("core | actions | disconnect", async () => {
	const { keyPairConnector } = await import("@midl-xyz/midl-js-node");

	it("disconnects and saves latest network", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [keyPairConnector({ mnemonic: __TEST__MNEMONIC__ })],
		});

		await connect(config, { purposes: [AddressPurpose.Payment] });

		await disconnect(config);

		const { network, connection, accounts } = config.getState();

		expect(network).toBeDefined();
		expect(connection).toBeUndefined();
		expect(accounts).toBeUndefined();
	});

	it("calls beforeDisconnect", async () => {
		const connector = keyPairConnector({
			mnemonic: __TEST__MNEMONIC__,
		});
		const mockDisconnect = vi.fn();

		(connector as Connector).beforeDisconnect = mockDisconnect;

		const config = createConfig({
			networks: [regtest],
			connectors: [connector],
		});

		await connect(config, { purposes: [AddressPurpose.Payment] });

		await disconnect(config);

		expect(mockDisconnect).toHaveBeenCalled();
	});
});
