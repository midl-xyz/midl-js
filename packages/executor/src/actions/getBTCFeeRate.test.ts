import { http, type Chain, createPublicClient } from "viem";
import { describe, expect, it } from "vitest";
import { getBTCFeeRate } from "~/actions/getBTCFeeRate";
import { midlRegtest } from "~/config";

describe("executor | actions | getBTCFeeRate", () => {
	it.skip("works with viem", async () => {
		const client = createPublicClient({
			chain: midlRegtest as Chain,
			transport: http(midlRegtest.rpcUrls.default.http[0]),
		});

		const result = await getBTCFeeRate(client);

		expect(result).toBeGreaterThan(1n);
	});
});
