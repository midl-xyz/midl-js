import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mockServer } from "~/__tests__/mockServer";
import { waitForTransaction } from "~/actions/waitForTransaction";
import { unisatConnector } from "~/connectors";
import { type Config, createConfig } from "~/createConfig";
import { regtest } from "~/networks";

const txId = "1";

describe("core | actions | waitForTransaction", () => {
	let config: Config;

	//  Close server after all tests
	afterAll(() => mockServer.close());

	beforeAll(() => {
		config = createConfig({
			networks: [regtest],
			connectors: [unisatConnector()],
		});

		mockServer.listen();
	});

	it("should wait for a transaction", async () => {
		expect(await waitForTransaction(config, txId)).toBeGreaterThanOrEqual(1);
	});
});
