import { http, HttpResponse, type RequestHandler } from "msw";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createConfig } from "~/createConfig";
import { mainnet, regtest, testnet4 } from "~/networks";
import { getFeeRate } from "./getFeeRate";

const expectedFeeRateMainnet = "87654";
const expectedFeeRateTestnet = "2345";
const expectedFeeRateRegtest = "25";

const handlers: RequestHandler[] = [
	http.get("https://mempool.space/api/v1/fees/recommended", () => {
		return HttpResponse.json(expectedFeeRateMainnet);
	}),

	http.get("https://mempool.space/testnet4/api/v1/fees/recommended", () => {
		return HttpResponse.json(expectedFeeRateTestnet);
	}),

	http.get("https://mempool.regtest.midl.xyz/api/v1/fees/recommended", () => {
		return HttpResponse.json(expectedFeeRateRegtest);
	}),
];

const server = setupServer(...handlers);

describe("core | actions | getFeeRate", () => {
	beforeAll(() => {
		server.listen();
	});

	afterAll(() => {
		server.close();
	});

	it("returns the fee rate for mainnet correctly", async () => {
		const config = createConfig({
			networks: [mainnet],
			connectors: [],
		});
		const currentFeeRate = await getFeeRate(config);

		expect(currentFeeRate).toEqual(expectedFeeRateMainnet);
	});

	it("returns the fee rate for testnet correctly", async () => {
		const config = createConfig({
			networks: [testnet4],
			connectors: [],
		});
		const currentFeeRate = await getFeeRate(config);
		expect(currentFeeRate).toEqual(expectedFeeRateTestnet);
	});

	it("returns the fee rate for regtest correctly", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
		});
		const currentFeeRate = await getFeeRate(config);

		expect(currentFeeRate).toEqual(expectedFeeRateRegtest);
	});

	it("throws error if config doesn't contains network", async () => {
		const config = createConfig({
			networks: [],
			connectors: [],
		});
		await expect(getFeeRate(config)).rejects.toThrowError("No network");
	});
});
