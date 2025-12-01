import { http, type Chain, createPublicClient } from "viem";
import { describe, expect, it, vi } from "vitest";
import { getBTCFeeRate } from "~/actions/getBTCFeeRate";
import { midlRegtest } from "~/config";

vi.mock("viem/actions", async (importActual) => {
	const actual = await importActual<typeof import("viem/actions")>();
	return {
		...actual,
		readContract: vi.fn().mockImplementation(async () => 123n),
	};
});

describe("executor | actions | getBTCFeeRate", () => {
	it("works with viem", async () => {
		const client = createPublicClient({
			chain: midlRegtest as Chain,
			transport: http(midlRegtest.rpcUrls.default.http[0]),
		});

		const result = await getBTCFeeRate(client);

		expect(result).toBe(123n);
	});
});
