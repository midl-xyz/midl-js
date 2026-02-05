import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { __TEST__MNEMONIC__ } from "~/__tests__/keyPair.js";
import { mockServer } from "~/__tests__/mockServer.js";
import { waitForTransaction } from "~/actions/waitForTransaction.js";
import { type Config, createConfig } from "~/createConfig.js";
import { regtest } from "~/networks/index.js";

const txId = "1";

describe.skip("core | actions | waitForTransaction", async () => {
	const { keyPairConnector } = await import("@midl/node");

	let config: Config;

	//  Close server after all tests
	afterAll(() => mockServer.close());

	beforeAll(() => {
		config = createConfig({
			networks: [regtest],
			connectors: [
				keyPairConnector({
					mnemonic: __TEST__MNEMONIC__,
				}),
			],
		});

		mockServer.listen();
	});

	it("should wait for a transaction", async () => {
		expect(await waitForTransaction(config, txId, 1)).toBeGreaterThanOrEqual(1);
	});
});
