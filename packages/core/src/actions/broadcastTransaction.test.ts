import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mockServer } from "~/__tests__/mockServer";
import { broadcastTransaction } from "~/actions/broadcastTransaction";
import { unisatConnector } from "~/connectors";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";

describe("core | actions | broadcastTransaction", () => {
	beforeAll(() => {
		mockServer.listen();
	});

	afterAll(() => {
		mockServer.close();
	});

	it("should broadcast a transaction", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [unisatConnector()],
		});

		const result = await broadcastTransaction(config, "txHex");

		expect(result.length).toBe(64);
	});
});
