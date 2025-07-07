import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getKeyPair } from "~/__tests__/keyPair";
import { mockServer } from "~/__tests__/mockServer";
import { broadcastTransaction } from "~/actions/broadcastTransaction";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";

describe("core | actions | broadcastTransaction", async () => {
	const { keyPairConnector } = await import("@midl-xyz/midl-js-node");

	beforeAll(() => {
		mockServer.listen();
	});

	afterAll(() => {
		mockServer.close();
	});

	it("should broadcast a transaction", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [keyPairConnector({ keyPair: getKeyPair() })],
		});

		const result = await broadcastTransaction(config, "txHex");

		expect(result.length).toBe(64);
	});
});
