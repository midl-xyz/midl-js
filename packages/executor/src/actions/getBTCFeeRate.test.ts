import { describe, expect, it } from "vitest";
import { JsonRpcProvider } from "ethers";
import { midlRegtest } from "~/config";
import { getBTCFeeRate } from "~/actions/getBTCFeeRate";
import { midlConfig } from "~/__tests__/midlConfig";
import { type Chain, createPublicClient, http, zeroAddress } from "viem";

describe("executor | actions | getBTCFeeRate", () => {
	it("works with ethers", async () => {
		const provider = new JsonRpcProvider(midlRegtest.rpcUrls.default.http[0]);
		const result = await getBTCFeeRate(midlConfig, provider);

		expect(result).toBeGreaterThan(1n);
	});

	it("works with viem", async () => {
		const client = createPublicClient({
			chain: midlRegtest as Chain,
			transport: http(midlRegtest.rpcUrls.default.http[0]),
		});

		const result = await getBTCFeeRate(midlConfig, client);

		expect(result).toBeGreaterThan(1n);
	});
});
