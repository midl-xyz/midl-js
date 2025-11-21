import { http, createPublicClient } from "viem";
import * as viemActions from "viem/actions";
import { type Mock, describe, expect, it, vi } from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { getTSSAddress } from "~/actions/getTSSAddress";
import { midlRegtest } from "~/config";

vi.mock("viem/actions", async (importActual) => {
	const actual = await importActual<typeof import("viem/actions")>();

	return {
		...actual,
		readContract: vi.fn(),
	};
});

describe("getTSSAddress", () => {
	it("should retrieve the TSS address", async () => {
		const pk =
			"0x1b445f2fd3aa40c180578a63025a619717811c8a8a773afadfbf7a02d27f5552";

		const client = createPublicClient({
			chain: midlRegtest,
			transport: http(midlRegtest.rpcUrls.default.http[0]),
		});

		(viemActions.readContract as Mock).mockResolvedValueOnce(pk);

		const p2trAddress =
			"bcrt1prdz97t7n4fqvrqzh3f3syknpjutcz8y23fmn47klhaaq95nl24fq57u8tq";

		await expect(getTSSAddress(midlConfig, client)).resolves.toBe(p2trAddress);
	});
});
