import { http, HttpResponse, type RequestHandler } from "msw";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mockServer } from "~/__tests__/mockServer";
import { createConfig } from "~/createConfig";
import { mainnet, regtest, testnet4 } from "~/networks";
import { getBlockNumber } from "./getBlockNumber";

const expectedBlockNumberTestnet = 2345;
const expectedBlockNumberMainnet = 87654;

const handlers: RequestHandler[] = [
	http.get("https://mempool.space/api/blocks/tip/height", () => {
		return HttpResponse.text(expectedBlockNumberMainnet.toString());
	}),

	http.get("https://mempool.space/testnet4/api/blocks/tip/height", () => {
		return HttpResponse.text(expectedBlockNumberTestnet.toString());
	}),
];

const server = setupServer(...handlers);

describe("core | actions | getBlockNumber", () => {
	beforeAll(() => {
		server.listen();
	});

	afterAll(() => {
		server.close();
	});

	it("returns the correct mainnet block number", async () => {
		const config = createConfig({
			networks: [mainnet],
			connectors: [],
		});

		expect(await getBlockNumber(config)).toEqual(expectedBlockNumberMainnet);
	});

	it("returns the correct testnet block number", async () => {
		const config = createConfig({
			networks: [testnet4],
			connectors: [],
		});

		expect(await getBlockNumber(config)).toEqual(expectedBlockNumberTestnet);
	});

	it("returns the correct regtest block number", async () => {
		mockServer.listen();

		const config = createConfig({
			networks: [regtest],
			connectors: [],
		});

		expect(await getBlockNumber(config)).toEqual(0);
	});
});
