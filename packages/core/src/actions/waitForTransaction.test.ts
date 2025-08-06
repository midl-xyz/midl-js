import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { __TEST__MNEMONIC__ } from "~/__tests__/keyPair";
import { mockServer } from "~/__tests__/mockServer";
import { waitForTransaction } from "~/actions/waitForTransaction";
import { type Config, createConfig } from "~/createConfig";
import { regtest } from "~/networks";

const txId = "1";

describe("core | actions | waitForTransaction", async () => {
	const { keyPairConnector } = await import("@midl-xyz/midl-js-node");

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
		expect(await waitForTransaction(config, txId)).toBeGreaterThanOrEqual(1);
	});
});
