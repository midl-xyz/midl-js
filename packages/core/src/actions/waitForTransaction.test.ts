import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { waitForTransaction } from "~/actions/waitForTransaction";
import { satsConnect } from "~/connectors";
import { type Config, createConfig } from "~/createConfig";
import { testnet } from "~/networks";

const txId = "1";

const restHandlers = [
	http.get(`${testnet.rpcUrl}/tx/${txId}/status`, () => {
		return HttpResponse.json({
			block_height: 1,
			confirmed: true,
		});
	}),
	http.get(`${testnet.rpcUrl}/blocks/tip/height`, () => {
		return HttpResponse.text("2");
	}),
];

const server = setupServer(...restHandlers);

describe("core | actions | waitForTransaction", () => {
	let config: Config;

	//  Close server after all tests
	afterAll(() => server.close());

	// Reset handlers after each test `important for test isolation`
	afterEach(() => server.resetHandlers());

	beforeAll(() => {
		config = createConfig({
			networks: [testnet],
			connectors: [satsConnect()],
		});

		server.listen({ onUnhandledRequest: "error" });
	});

	it("should wait for a transaction", async () => {
		expect(await waitForTransaction(config, txId)).toBeGreaterThanOrEqual(1);
	});
});
